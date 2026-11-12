import { IpoRegistrar } from '../types/ipo.js';

export interface RegistrarMeta {
  code: IpoRegistrar;
  name: string;
  website: string;
  hasDirectAllotmentPortal: boolean;
}

export const REGISTRAR_REGISTRY: Record<IpoRegistrar, RegistrarMeta> = {
  LINK_INTIME: {
    code: 'LINK_INTIME',
    name: 'Link Intime India Pvt. Ltd.',
    website: 'https://linkintime.co.in',
    hasDirectAllotmentPortal: true,
  },
  KFINTECH: {
    code: 'KFINTECH',
    name: 'KFin Technologies Ltd.',
    website: 'https://kfintech.com',
    hasDirectAllotmentPortal: true,
  },
  BIGSHARE: {
    code: 'BIGSHARE',
    name: 'Bigshare Services Pvt. Ltd.',
    website: 'https://bigshareonline.com',
    hasDirectAllotmentPortal: true,
  },
  CAMEO: {
    code: 'CAMEO',
    name: 'Cameo Corporate Services Ltd.',
    website: 'https://cameoindia.com',
    hasDirectAllotmentPortal: true,
  },
  SKYLINE: {
    code: 'SKYLINE',
    name: 'Skyline Financial Services',
    website: 'https://skylinerta.com',
    hasDirectAllotmentPortal: true,
  },
  PURVA: {
    code: 'PURVA',
    name: 'Purva Sharegistry (India) Pvt. Ltd.',
    website: 'https://purvashare.com',
    hasDirectAllotmentPortal: true,
  },
  OTHER: {
    code: 'OTHER',
    name: 'Other / Designated Registrar',
    website: '',
    hasDirectAllotmentPortal: false,
  },
};
