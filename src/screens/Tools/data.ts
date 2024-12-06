/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

import {useMultiIconProps} from '@/common/components/MultiIcon';
import {ToolsStackPage} from '@/navigation/types';
import {Translation} from '@/stores/persistent/translations';

export interface ToolItem {
  title: Translation;
  description: Translation;
  icon: useMultiIconProps;
  screen: ToolsStackPage;
}

/******************************************************************************
 *                                   ITEMS                                    *
 ******************************************************************************/

const ProviderStudio: ToolItem = {
  title: 'Provider Studio',
  description: 'Build and test new providers',
  icon: {name: 'puzzle-edit'},
  screen: 'providerStudio',
} as const;

const FileAnalysis: ToolItem = {
  title: 'File Analysis',
  description: 'Scan files with VirusTotal for threats',
  icon: {name: 'file-search'},
  screen: 'fileAnalysis',
} as const;

const FileFingerprint: ToolItem = {
  title: 'File Fingerprint',
  description: 'Generate the SHA-256 hash of a file',
  icon: {name: 'fingerprint', type: 'material-icons'},
  screen: 'fileFingerprint',
} as const;

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export const TOOLS = [ProviderStudio, FileAnalysis, FileFingerprint];
