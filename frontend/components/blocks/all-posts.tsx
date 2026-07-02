import SectionContainer from "@/components/ui/section-container";
import PostCard from "@/components/ui/post-card";
import {
  fetchSanityPosts,
  fetchSanityProducts,
  fetchSanityProjects,
  fetchSanityServices,
} from "@/sanity/lib/fetch";
import { PAGE_QUERY_RESULT } from "@/sanity.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ListingType = "post" | "service" | "product" | "project";

type ListingItem = {
  _type: ListingType;
  slug: string;
  title: string;
  excerpt: string;
  image: any;
  categories: any[];
};

type AllPostsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "all-posts" }
>;

const TYPE_ROUTE_MAP: Record<ListingType, string> = {
  post: "/blog",
  service: "/services",
  product: "/products",
  project: "/projects",
};

const normalizeItems = (items: any[], type: ListingType): ListingItem[] => {
  return items
    .filter((item) => item?.title && item?.slug?.current)
    .map((item) => ({
      _type: type,
      slug: String(item.slug.current),
      title: String(item.title),
      excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
      image: item.image ?? null,
      categories: Array.isArray(item.categories) ? item.categories : [],
    }));
};

export default async function AllPosts({ blockStyles, 
      
      
      ...props
    }: AllPostsProps) {
  const displayMode = ((props as any).displayMode as "default" | "carousel" | undefined) || "default";
  const selectedTypes = Array.isArray((props as any).contentTypes)
    ? ((props as any).contentTypes as string[]).filter(Boolean)
    : ["post"];
  const validTypes = selectedTypes.filter((item): item is ListingType =>
    ["post", "service", "product", "project"].includes(item),
  );
  const contentTypes = validTypes.length > 0 ? validTypes : (["post"] as ListingType[]);
  const itemLimit = Math.max(1, Math.min(24, Number((props as any).limit) || 6));

  const [posts, services, products, projects] = await Promise.all([
    contentTypes.includes("post") ? fetchSanityPosts() : Promise.resolve([]),
    contentTypes.includes("service") ? fetchSanityServices() : Promise.resolve([]),
    contentTypes.includes("product") ? fetchSanityProducts() : Promise.resolve([]),
    contentTypes.includes("project") ? fetchSanityProjects() : Promise.resolve([]),
  ]);

  const pools: Record<ListingType, ListingItem[]> = {
    post: normalizeItems(posts as any[], "post"),
    service: normalizeItems(services as any[], "service"),
    product: normalizeItems(products as any[], "product"),
    project: normalizeItems(projects as any[], "project"),
  };

  const items = contentTypes.flatMap((type) => pools[type]).slice(0, itemLimit);

  return (
    <SectionContainer blockStyles={blockStyles}>
      {displayMode === "carousel" ? (
        <Carousel opts={{ align: "start", loop: false }}>
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={`${item._type}:${item.slug}`} className="basis-full md:basis-1/2 lg:basis-1/3">
                <PostCard
                  href={`${TYPE_ROUTE_MAP[item._type]}/${item.slug}`}
                  title={item.title}
                  excerpt={item.excerpt}
                  image={item.image}
                  categories={item.categories}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 bg-background/90 border-border/60" />
          <CarouselNext className="-right-2 bg-background/90 border-border/60" />
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <PostCard
              key={`${item._type}:${item.slug}`}
              className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href={`${TYPE_ROUTE_MAP[item._type]}/${item.slug}`}
              title={item.title}
              excerpt={item.excerpt}
              image={item.image}
              categories={item.categories}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
