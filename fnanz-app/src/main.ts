import { importProvidersFrom, mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  ButtonModule,
  DropdownModule,
  FooterModule,
  HeaderModule,
  IconModule,
  NavbarModule,
  NavModule,
  SidebarModule,
  TooltipModule
} from '@coreui/angular';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const coreUIConfig = {
  providers: [
    provideAnimationsAsync(),
    importProvidersFrom(
      SidebarModule,
      DropdownModule,
      TooltipModule,
      HeaderModule,
      NavModule,
      NavbarModule,
      FooterModule,
      IconModule,
      ButtonModule
    )
  ]
};

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, coreUIConfig)).catch((err) =>
  console.error('Bootstrap error', err)
);
