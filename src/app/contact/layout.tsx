import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/brand";
export const metadata: Metadata = { title: "Contact and Submissions", description: `Contact ${SITE_NAME} about original writing in Brahui and translations into Brahui.` };
export default function ContactLayout({ children }: { children: React.ReactNode }) { return children; }
