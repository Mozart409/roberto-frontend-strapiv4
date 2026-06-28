import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

import { FALLBACK_SEO } from "@/app/utils/constants";

import { Toaster } from "react-hot-toast";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

async function getGlobal(lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) {
    throw new Error("The Strapi API Token environment variable is not set.");
  }

  const path = "/global";
  const options = { headers: { Authorization: `Bearer ${token}` } };

  // Strapi v5 no longer accepts dot-notation populate strings; nested
  // relations/components must be described as objects.
  const urlParamsObject = {
    populate: {
      metadata: true,
      favicon: true,
      notificationBanner: { populate: { link: true } },
      navbar: {
        populate: {
          links: true,
          button: true,
          navbarLogo: { populate: { logoImg: true } },
        },
      },
      footer: {
        populate: {
          footerLogo: { populate: { logoImg: true } },
          menuLinks: true,
          legalLinks: true,
          socialLinks: true,
          categories: true,
        },
      },
    },
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = "de";
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const meta: any = await getGlobal(lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data.attributes;
  const { url } = favicon.data.attributes;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const lang = "de";

  const { children } = props;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const global: any = await getGlobal(lang);
  if (!global.data) {
    return (
      <html lang={lang}>
        <body>
          <main className="flex flex-col px-4 min-h-screen dark:text-gray-100 dark:bg-black">
            <div className="px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl text-red-500">Error</h1>
            </div>
          </main>
        </body>
      </html>
    );
  }

  const { notificationBanner, navbar, footer } = global.data.attributes;

  if (!navbar || !footer) {
    return (
      <html lang={lang}>
        <body>
          <main className="flex flex-col px-4 min-h-screen dark:text-gray-100 dark:bg-black">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </body>
      </html>
    );
  }

  const navbarLogoUrl = getStrapiMedia(
    navbar.navbarLogo.logoImg.data.attributes.url,
  );

  const footerLogoUrl = getStrapiMedia(
    footer.footerLogo.logoImg.data.attributes.url,
  );

  return (
    <html lang={lang}>
      <body>
        {navbarLogoUrl ? (
          <Navbar
            links={navbar.links}
            logoUrl={navbarLogoUrl}
            logoText={navbar.navbarLogo.logoText}
          />
        ) : null}

        <main className="flex flex-col px-4 min-h-screen dark:text-gray-100 dark:bg-black">
          {children}
        </main>

        {notificationBanner ? <Banner data={notificationBanner} /> : null}

        <Footer
          logoUrl={footerLogoUrl}
          logoText={footer.footerLogo.logoText}
          menuLinks={footer.menuLinks}
          categoryLinks={footer.categories?.data ?? []}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        />

        <Toaster toastOptions={{ duration: 7000 }} />
      </body>
    </html>
  );
}

/* export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
} */
