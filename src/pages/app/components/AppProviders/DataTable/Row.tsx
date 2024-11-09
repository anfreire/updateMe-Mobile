import * as React from 'react';
import {DataTable} from 'react-native-paper';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import Cell from './Cells';
import {CurrAppProps} from '@/hooks/useCurrApp';
import {useToast} from '@/states/runtime/toast';
import {Linking} from 'react-native';
import {CellProps} from './Cells';
import Clipboard from '@react-native-clipboard/clipboard';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const WEBSITE_FLOATING_ICON: CellProps['floatingIcon'] = {
  type: 'material-icons',
  name: 'open-in-new',
};

const COPY_FLOATING_ICON: CellProps['floatingIcon'] = {
  type: 'material-icons',
  name: 'content-copy',
};

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useAppProvidersDataTableRow(
  currApp: CurrAppProps,
  provider: string,
  tableSize: {
    provider: number;
    secure: number;
    packageName: number;
    version: number;
    sha256: number;
  },
) {
  const translations = useTranslations(state => state.translations);
  const openToast = useToast(state => state.openToast);

  const copyAndOpenToast = React.useCallback(
    (message: string, toCopy: string) => {
      Clipboard.setString(toCopy);
      openToast(message);
    },
    [],
  );

  const cellProps: CellProps[] = React.useMemo(
    () => [
      {
        text: provider,
        onPressMessage: interpolate(
          translations['Long press to open $1 website'],
          provider,
        ),
        onLongPress: () => Linking.openURL(currApp.providers[provider].source),
        width: tableSize.provider,
        isFirst: true,
        floatingIcon: WEBSITE_FLOATING_ICON,
      },
      {
        icon: currApp.providers[provider].safe ? 'check' : 'close',
        onPressMessage: translations['Long press to open VirusTotal analysis'],
        onLongPress: () =>
          Linking.openURL(
            `https://www.virustotal.com/gui/file/${currApp.providers[provider].sha256}`,
          ),
        width: tableSize.secure,
        floatingIcon: WEBSITE_FLOATING_ICON,
      },
      {
        text: currApp.providers[provider].packageName,
        onPressMessage: interpolate(
          translations['Long press to copy $1 package name'],
          provider,
        ),
        onLongPress: () =>
          copyAndOpenToast(
            interpolate(
              translations["$1's package name copied to clipboard"],
              provider,
            ),
            currApp.providers[provider].packageName,
          ),

        width: tableSize.packageName,
        floatingIcon: COPY_FLOATING_ICON,
      },
      {
        text: currApp.providers[provider].version,
        onPressMessage: interpolate(
          translations['Long press to copy $1 version'],
          provider,
        ),
        onLongPress: () =>
          copyAndOpenToast(
            interpolate(
              translations["$1's version copied to clipboard"],
              provider,
            ),
            currApp.providers[provider].version,
          ),
        width: tableSize.version,
        floatingIcon: COPY_FLOATING_ICON,
      },
      {
        text: currApp.providers[provider].sha256,
        onPressMessage: interpolate(
          translations['Long press to copy $1 SHA-256'],
          provider,
        ),
        onLongPress: () =>
          copyAndOpenToast(
            interpolate(
              translations["$1's SHA-256 copied to clipboard"],
              provider,
            ),
            currApp.providers[provider].sha256,
          ),
        width: tableSize.sha256,
        floatingIcon: COPY_FLOATING_ICON,
      },
    ],
    [currApp.providers, provider, tableSize, translations, copyAndOpenToast],
  );

  return {cellProps};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppProvidersDataTableRowProps {
  currApp: CurrAppProps;
  provider: string;
  tableSize: {
    provider: number;
    secure: number;
    packageName: number;
    version: number;
    sha256: number;
  };
}

const AppProvidersDataTableRow = ({
  currApp,
  provider,
  tableSize,
}: AppProvidersDataTableRowProps) => {
  const {cellProps} = useAppProvidersDataTableRow(currApp, provider, tableSize);

  return (
    <DataTable.Row>
      {cellProps.map((props, index) => (
        <Cell key={`${provider}-${index}`} {...props} />
      ))}
    </DataTable.Row>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppProvidersDataTableRow);
