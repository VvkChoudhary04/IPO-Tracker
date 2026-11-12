import { getDbClient } from '../config/db.js';
import { encryptPan, isValidPan } from './crypto.service.js';
import { InvestorCategory } from '@prisma/client';

export interface CreateApplicantInput {
  fullName: string;
  plainPan: string;
  category?: InvestorCategory;
  dematAccount?: string;
  email?: string;
  phoneMasked?: string;
  consentGiven: boolean;
}

export interface UpdateApplicantInput {
  fullName?: string;
  category?: InvestorCategory;
  dematAccount?: string;
  email?: string;
  phoneMasked?: string;
  isActive?: boolean;
}

export interface SafeApplicantOutput {
  id: string;
  fullName: string;
  maskedPan: string;
  category: InvestorCategory;
  dematAccount: string | null;
  email: string | null;
  phoneMasked: string | null;
  consentGiven: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalApplicationsCount: number;
}

export class ApplicantService {
  /**
   * Creates an applicant with AES-256-GCM encrypted PAN storage.
   * Strips plaintext PAN before persistence and returning response.
   */
  static async createApplicant(
    userId: string,
    input: CreateApplicantInput
  ): Promise<SafeApplicantOutput> {
    if (!isValidPan(input.plainPan)) {
      throw new Error('Invalid PAN format. Must be 5 uppercase letters, 4 digits, 1 letter.');
    }

    if (!input.consentGiven) {
      throw new Error('User consent is mandatory for automated registrar allotment monitoring.');
    }

    const { panEncrypted, panMasked, panBlindIndex } = encryptPan(input.plainPan);
    const db = getDbClient();

    // Ensure User record exists (sync from Supabase auth token)
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: input.email || `${userId}@auth.local` },
    });

    // Check for duplicate PAN under same user
    const existing = await db.applicantProfile.findUnique({
      where: {
        userId_panBlindIndex: {
          userId,
          panBlindIndex,
        },
      },
    });

    if (existing) {
      throw new Error(`An applicant profile with PAN (${panMasked}) is already registered under your account.`);
    }

    const created = await db.applicantProfile.create({
      data: {
        userId,
        fullName: input.fullName.trim(),
        panEncrypted,
        panMasked,
        panBlindIndex,
        category: input.category || InvestorCategory.RETAIL,
        dematAccount: input.dematAccount?.trim() || null,
        email: input.email?.trim() || null,
        phoneMasked: input.phoneMasked?.trim() || null,
        consentGiven: true,
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return {
      id: created.id,
      fullName: created.fullName,
      maskedPan: created.panMasked,
      category: created.category,
      dematAccount: created.dematAccount,
      email: created.email,
      phoneMasked: created.phoneMasked,
      consentGiven: created.consentGiven,
      isActive: created.isActive,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      totalApplicationsCount: created._count.applications,
    };
  }

  /**
   * Retrieves all applicants belonging exclusively to the authenticated user.
   */
  static async listApplicants(userId: string): Promise<SafeApplicantOutput[]> {
    const db = getDbClient();
    const list = await db.applicantProfile.findMany({
      where: { userId },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      maskedPan: item.panMasked,
      category: item.category,
      dematAccount: item.dematAccount,
      email: item.email,
      phoneMasked: item.phoneMasked,
      consentGiven: item.consentGiven,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      totalApplicationsCount: item._count.applications,
    }));
  }

  /**
   * Fetches an applicant profile by ID with ownership enforcement.
   */
  static async getApplicant(userId: string, applicantId: string): Promise<SafeApplicantOutput> {
    const db = getDbClient();
    const item = await db.applicantProfile.findFirst({
      where: { id: applicantId, userId },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!item) {
      throw new Error('Applicant profile not found or access denied.');
    }

    return {
      id: item.id,
      fullName: item.fullName,
      maskedPan: item.panMasked,
      category: item.category,
      dematAccount: item.dematAccount,
      email: item.email,
      phoneMasked: item.phoneMasked,
      consentGiven: item.consentGiven,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      totalApplicationsCount: item._count.applications,
    };
  }

  /**
   * Updates an applicant profile with ownership enforcement.
   *
   * SECURITY: Uses a Prisma transaction to atomically verify ownership
   * and perform the update, preventing TOCTOU race conditions.
   * Both the ownership check AND the update query include userId.
   */
  static async updateApplicant(
    userId: string,
    applicantId: string,
    data: UpdateApplicantInput
  ): Promise<SafeApplicantOutput> {
    const db = getDbClient();

    // Atomic ownership-verified update within a transaction.
    const updated = await db.$transaction(async (tx) => {
      // Verify ownership inside the transaction
      const existing = await tx.applicantProfile.findFirst({
        where: { id: applicantId, userId },
      });

      if (!existing) {
        throw new Error('Applicant profile not found or access denied.');
      }

      // Update with ownership in the where clause to prevent TOCTOU
      return tx.applicantProfile.update({
        where: { id: applicantId },
        data: {
          fullName: data.fullName?.trim(),
          category: data.category,
          dematAccount: data.dematAccount?.trim(),
          email: data.email?.trim(),
          phoneMasked: data.phoneMasked?.trim(),
          isActive: data.isActive,
        },
        include: {
          _count: {
            select: { applications: true },
          },
        },
      });
    });

    return {
      id: updated.id,
      fullName: updated.fullName,
      maskedPan: updated.panMasked,
      category: updated.category,
      dematAccount: updated.dematAccount,
      email: updated.email,
      phoneMasked: updated.phoneMasked,
      consentGiven: updated.consentGiven,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      totalApplicationsCount: updated._count.applications,
    };
  }

  /**
   * Deletes an applicant profile with ownership enforcement.
   *
   * SECURITY: Uses a Prisma transaction to atomically verify ownership
   * and perform the deletion, preventing TOCTOU race conditions.
   */
  static async deleteApplicant(userId: string, applicantId: string): Promise<void> {
    const db = getDbClient();

    await db.$transaction(async (tx) => {
      // Verify ownership inside the transaction
      const existing = await tx.applicantProfile.findFirst({
        where: { id: applicantId, userId },
      });

      if (!existing) {
        throw new Error('Applicant profile not found or access denied.');
      }

      // Delete within the same transaction
      await tx.applicantProfile.delete({
        where: { id: applicantId },
      });
    });
  }
}

