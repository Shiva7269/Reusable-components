import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { registerLicense } from '@syncfusion/ej2-base';
import { environment } from './environments/environment';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x3Q3xbf1x0ZFFMZVtbR3ZPMyBoS35RckVnWHledHFSRWFaUkBx');

  if (environment.production) {
    enableProdMode();
  }
  
  // platformBrowserDynamic().bootstrapModule(AppModule)
  //   .catch(err => console.error(err));