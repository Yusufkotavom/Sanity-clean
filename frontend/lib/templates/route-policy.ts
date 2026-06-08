export function isAllowedTemplateRoute(route?: string | null) {
  // Secara otomatis mengizinkan seluruh rute yang valid (dimulai dengan "/")
  // Pengecekan akhir apakah rute tersebut benar-benar ada akan 
  // divalidasi langsung dari hasil query Sanity CMS.
  if (!route || !route.startsWith("/")) return false;
  
  return true;
}
