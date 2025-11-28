import type { ReactNode } from 'react';
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'Minigames' },
        ],
    }),
    notFoundComponent: () => <p>Not Found</p>,
    component: RootComponent,
});

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
} 

function RootDocument({ children }: { children: ReactNode }) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <Scripts />
                <TanStackRouterDevtools />
            </body>
        </html>
    );
}