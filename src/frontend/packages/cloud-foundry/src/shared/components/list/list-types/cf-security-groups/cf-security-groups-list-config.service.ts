import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CFAppState } from '../../../../../../../cloud-foundry/src/cf-app-state';
import { ITableColumn } from '../../../../../../../core/src/shared/components/list/list-table/table.types';
import { APIResource } from '../../../../../../../store/src/types/api.types';
import { ActiveRouteCfOrgSpace } from '../../../../../features/cf/cf-page.types';
import { BaseCfListConfig } from '../base-cf/base-cf-list-config';
import { CfSecurityGroupsCardComponent } from './cf-security-groups-card/cf-security-groups-card.component';
import { CfSecurityGroupsDataSource } from './cf-security-groups-data-source';

@Injectable()
export class CfSecurityGroupsListConfigService extends BaseCfListConfig<APIResource> {
  dataSource: CfSecurityGroupsDataSource;
  cardComponent = CfSecurityGroupsCardComponent;
  enableTextFilter = true;
  text = {
    title: null,
    filter: 'Search by name',
    noEntries: 'There are no security groups'
  };
  columns: ITableColumn<APIResource>[] = [{
    columnId: 'name',
    headerCell: () => 'Name',
    sort: {
      type: 'sort',
      orderKey: 'name',
      field: 'entity.name'
    }
  }, {
    columnId: 'createdAt',
    headerCell: () => 'Creation',
    sort: {
      type: 'sort',
      orderKey: 'createdAt',
      field: 'metadata.created_at'
    },
  }];

  constructor(private store: Store<CFAppState>, private activeRouteCfOrgSpace: ActiveRouteCfOrgSpace) {
    super();
    this.dataSource = new CfSecurityGroupsDataSource(this.store, activeRouteCfOrgSpace.cfGuid, this);
  }

  getColumns = () => this.columns;
  getDataSource = () => this.dataSource;
}
