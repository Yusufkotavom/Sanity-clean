import { client } from "@/sanity/lib/client";
import {
  SITE_SETTINGS_QUERY,
  HOME_CONTENT_QUERY,
  FAQ_QUERY,
  WHY_CHOOSE_REASONS_QUERY,
  SERVICE_LANES_QUERY,
  SERVICE_CLUSTERS_QUERY,
} from "@/sanity/queries/content";

export async function fetchSiteSettings() {
  return await client.fetch(SITE_SETTINGS_QUERY);
}

export async function fetchHomeContent() {
  return await client.fetch(HOME_CONTENT_QUERY);
}

export async function fetchFAQs() {
  return await client.fetch(FAQ_QUERY);
}

export async function fetchWhyChooseReasons() {
  return await client.fetch(WHY_CHOOSE_REASONS_QUERY);
}

export async function fetchServiceLanes() {
  return await client.fetch(SERVICE_LANES_QUERY);
}

export async function fetchServiceClusters() {
  return await client.fetch(SERVICE_CLUSTERS_QUERY);
}