/**
 * The default base url for calls to the D&D API.
 */
 export const DEFAULT_BASE_MONSTER_URL = "https://www.dnd5eapi.co";

 /**
  *
  * @param {string} [baseUrl=DEFAULT_BASE_MONSTER_URL] Location of the API endpoint.
  * @returns D&D API client
  */
 export function createClient(baseUrl) {
   return {
     /**
      * Gets the monster with the specified index.
      * @param {string} index
      * @returns {Promise<any>} Monster object
      */
     getMonster: async function (index) {
       const url = getMonsterUrl(index, baseUrl);
       const response = await fetch(url);
       if (response.ok) {
         return response.json();
       }
       const { status, statusText } = response;
       return {
         status,
         statusText,
       };
     },
     /**
      * Gets all monsters.
      * @param {string} [filter] If specified, only include monsters whose names match this value.
      * @returns {Promise<any[]>} Array of monster objects
      */
     getMonsters: async function (filter) {
       const url = getMonstersUrl(baseUrl, filter);
       const response = await fetch(url);
       if (response.ok) {
         const json = await response.json();
         return json.results;
       }
       const { status, statusText } = response;
       return {
         status,
         statusText,
       };
     },
     /**
      * Gets the base url the client uses.
      * @returns {string} url
      */
     getUrl: function () {
       if (!baseUrl || baseUrl == "") return DEFAULT_BASE_MONSTER_URL;
       return baseUrl;
     },
   };
 }
 
 function getMonstersUrl(baseUrl, filter) {
   const url = new URL(
     "/api/monsters",
     baseUrl ? baseUrl : DEFAULT_BASE_MONSTER_URL
   );
   if (filter) {
     url.searchParams.append("name", filter);
   }
   return url;
 }
 function getMonsterUrl(index, baseUrl) {
   return new URL(
     `/api/monsters/${index}`,
     baseUrl ? baseUrl : DEFAULT_BASE_MONSTER_URL
   );
 }
 