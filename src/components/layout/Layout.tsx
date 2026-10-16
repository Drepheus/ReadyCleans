import React, { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ReadyCleansLocalBusinessSchema } from '../seo/ReadyCleansSchema';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
            <ReadyCleansLocalBusinessSchema />
            <Navbar />
            <main className="flex-grow pt-[var(--header-height)]">
                {children}
            </main>
            <Footer />
        </div>
    );
};
