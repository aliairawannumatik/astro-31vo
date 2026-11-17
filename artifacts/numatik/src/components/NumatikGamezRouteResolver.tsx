import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { useParams } from "react-router-dom";
import { getSubmaterial } from "@/data/mga-k7/registry";
import { getSubmaterialK8 } from "@/data/mga-k8/registry";
import { getSubmaterialK9 } from "@/data/mga-k9/registry";

type Grade = 7 | 8 | 9;

const ChooserK7 = lazy(() => import("@/components/mga-k7/SubmaterialGameVariantsChooser"));
const ChooserK8 = lazy(() => import("@/components/mga-k8/SubmaterialGameVariantsChooser"));
const ChooserK9 = lazy(() => import("@/components/mga-k9/SubmaterialGameVariantsChooser"));
const DispatcherK7 = lazy(() => import("@/components/mga-k7/SubmaterialGameDispatcher"));
const DispatcherK8 = lazy(() => import("@/components/mga-k8/SubmaterialGameDispatcher"));
const DispatcherK9 = lazy(() => import("@/components/mga-k9/SubmaterialGameDispatcher"));

const resolveGrade = (parentSlug?: string, slug?: string): Grade | undefined => {
  if (!parentSlug || !slug) return undefined;
  if (getSubmaterial(parentSlug, slug)) return 7;
  if (getSubmaterialK8(parentSlug, slug)) return 8;
  if (getSubmaterialK9(parentSlug, slug)) return 9;
  return undefined;
};

const resolvePage = (
  grade: Grade | undefined,
  pages: Record<Grade, LazyExoticComponent<ComponentType>>,
) => {
  if (grade === 8) return pages[8];
  if (grade === 9) return pages[9];
  return pages[7];
};

export const NumatikGamezChooserResolver = () => {
  const { parentSlug, slug } = useParams<{ parentSlug: string; slug: string }>();
  const grade = resolveGrade(parentSlug, slug);
  const Page = resolvePage(grade, { 7: ChooserK7, 8: ChooserK8, 9: ChooserK9 });
  return <Page />;
};

export const NumatikGamezDispatcherResolver = () => {
  const { parentSlug, slug } = useParams<{ parentSlug: string; slug: string }>();
  const grade = resolveGrade(parentSlug, slug);
  const Page = resolvePage(grade, { 7: DispatcherK7, 8: DispatcherK8, 9: DispatcherK9 });
  return <Page />;
};
