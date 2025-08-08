import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import * as Aos from 'aos';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  Aos.init();
