import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

import { FALLBACK_SEO } from "@/app/utils/constants";

import { Toaster } from "react-hot-toast";
import { i18n } from "../../i18n-config";
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

  const urlParamsObject = {
    populate: [
      "metadata.shareImage",
      "favicon",
      "notificationBanner.link",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.menuLinks",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata(
  props: {
    params: Promise<{ lang: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const meta: any = await getGlobal(params.lang);

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

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const global: any = await getGlobal(params.lang);
  if (!global.data) {
    return (
      <html lang={params.lang}>
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
      <html lang={params.lang}>
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
    <html lang={params.lang}>
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
          categoryLinks={footer.categories.data}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        />

        <Toaster toastOptions={{ duration: 7000 }} />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
