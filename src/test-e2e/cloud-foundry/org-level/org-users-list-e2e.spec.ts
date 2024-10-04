import { CfUserTableTestLevel, setupCfUserTableTests } from '../users-list-e2e.helper';
import { CfOrgLevelPage } from './cf-org-level-page.po';

describe('Org Users List -', () => {
  setupCfUserTableTests(CfUserTableTestLevel.Org, (cfGuid, orgGuid) => {
    const orgPage = CfOrgLevelPage.forEndpoint(cfGuid, orgGuid);
    orgPage.navigateTo();
    orgPage.waitForPageOrChildPage();
    orgPage.loadingIndicator.waitUntilNotShown();
    return orgPage.goToUsersTab();
  });
});
