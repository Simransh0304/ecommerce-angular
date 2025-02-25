import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { jwtInterceptor } from './core/interceptors/interceptors';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function tokenGetter() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user).token : null;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      jwtInterceptor,
      errorInterceptor,
      loadingInterceptor
    ])),
    importProvidersFrom(
      CoreModule,
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: ['api.escuelajs.co'],
          disallowedRoutes: ['api.escuelajs.co/api/v1/auth/login']
        }
      })
    ),
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://api.escuelajs.co/graphql'
          })
        };
      },
      deps: [HttpLink]
    }
  ]
};
