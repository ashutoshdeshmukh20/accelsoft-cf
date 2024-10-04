// This file is auto-generated - DO NOT EDIT

import { NgModule } from '@angular/core';
import { CfAutoscalerPackageModule, CfAutoscalerRoutingModule } from '@stratosui/cf-autoscaler';
import { CloudFoundryPackageModule, CloudFoundryRoutingModule } from '@stratosui/cloud-foundry';
import { GitPackageModule, GitRoutingModule } from '@stratosui/git';
import { KubePackageModule, KubePackageModuleRoutingModule } from '@stratosui/kubernetes';

@NgModule(
{
  imports: [
    CfAutoscalerPackageModule,
    CloudFoundryPackageModule,
    GitPackageModule,
    KubePackageModule
  ]
})
export class CustomImportModule {}


@NgModule(
{
  imports: [
    CfAutoscalerRoutingModule,
    CloudFoundryRoutingModule,
    GitRoutingModule,
    KubePackageModuleRoutingModule
  ]
})
export class CustomRoutingImportModule {}

