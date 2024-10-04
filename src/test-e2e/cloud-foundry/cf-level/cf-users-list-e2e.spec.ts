import { CfUserTableTestLevel, setupCfUserTableTests } from '../users-list-e2e.helper';
import { CfTopLevelPage } from './cf-top-level-page.po';

describe('Cf Users List -', () => {
  setupCfUserTableTests(CfUserTableTestLevel.Cf, (cfGuid) => {
    const cfPage = CfTopLevelPage.forEndpoint(cfGuid);
    cfPage.navigateTo();
    cfPage.waitForPageOrChildPage();
    cfPage.loadingIndicator.waitUntilNotShown();
    return cfPage.goToUsersTab();
  });
});
