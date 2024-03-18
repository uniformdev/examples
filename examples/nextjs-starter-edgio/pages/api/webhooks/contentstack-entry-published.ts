import type { NextApiRequest, NextApiResponse } from 'next'
import { purgeEdgioCache } from '@/lib/edgioPurger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * As Uniform can not resolve list of paths for given Contentstack entries, we need to clear the whole cache
   * But due to Uniform Contentstack Integration webhook, data in Uniform will be purged automatically and
   * next request will use fresh data from Contentstack
   */

  /**
   * Here we do manual verification of the webhook via custom secret header
   * @see https://www.contentstack.com/docs/developers/set-up-webhooks/secure-your-webhooks#custom-headers
   */
  if (req.headers['x-verification-secret'] === process.env.CONTENTSTACK_WEBHOOK_VERIFICATION_SECRET) {
    await purgeEdgioCache();
    res.status(200).send('ok');
  } else {
    res.status(403).send(JSON.stringify({ reason: 'not authorized' }));
    return;
  }
}
