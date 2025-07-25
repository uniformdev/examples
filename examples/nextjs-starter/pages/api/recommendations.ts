import { RouteClient } from '@uniformdev/canvas';
import { NextApiRequest, NextApiResponse } from 'next';

const mockedRecommendations = {
    "id": "ab026bc3-1266-11ed-8ac4-97edf6b96075",
    "recommendationItem": [
        {
            "id": "16d303db-8217-426d-957b-56e0ab561913",
            "priority": 1,
            "product": {
                "id": "4035071891",
                "product": [
                    {
                        "id": "SDUMMY0",
                        "productOffering": {
                            "id": "SDUMMY0",
                            "name": "",
                            "@type": "ProductOfferingRef",
                            "@referredType": "ProductOfferingRef",
                            "offeringType": "ADD-ON"
                        },
                        "productPrice": [
                            {
                                "productPriceAlteration": [
                                    {
                                        "applicationDuration": 1,
                                        "recurringChargePeriod": "DAY",
                                        "price": {
                                            "dutyFreeAmount": {
                                                "unit": "CAD",
                                                "value": 0.0
                                            }
                                        },
                                        "@type": "PriceAlteration"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "productPrice": [
                    {
                        "priceType": "RECURRING",
                        "price": {
                            "dutyFreeAmount": {
                                "unit": "CAD",
                                "value": 0.0
                            }
                        }
                    }
                ],
                "productSpecification": {
                    "id": "POSTPAID",
                    "name": "PRODUCT_TYPE_CD",
                    "@referredType": "ProductSpecificationRef"
                },
                "productTerm": [
                    {
                        "name": "DEVICETERM",
                        "duration": {
                            "amount": 24.0,
                            "units": "MONTHS"
                        }
                    }
                ]
            },
            "productOffering": {
                "id": "1154911",
                "name": "PR-10GBFOR65-NS-MANUALPROMOTION",
                "@baseType": "ProductOfferingRef",
                "@type": "ProductOfferingRef",
                "@referredType": "ProductOfferingRef",
                "description": [
                    {
                        "locale": "en",
                        "description": "Loyalty Offer - $65 / 10GB Non-Share"
                    },
                    {
                        "locale": "fr",
                        "description": "Offre de Loyauté - 65 $ / 10 Go Sans Partage"
                    }
                ],
                "validFor": {
                    "endDateTime": "9999-01-01T00:00:00Z",
                    "startDateTime": "2022-06-16T17:23:24Z"
                },
                "offeringType": "PROMOTION"
            },
            "@baseType": "RecommendationItem",
            "@type": "RecommendationItem",
            "action": "Change",
            "recommendationMessage": [
                {
                    "type": "ProgramDescription",
                    "message": [
                        {
                            "locale": "en",
                            "description": "Manual Promotion for PR-10GBFOR65-NS"
                        },
                        {
                            "locale": "fr",
                            "description": "Manual Promotion for PR-10GBFOR65-NS"
                        }
                    ]
                }
            ],
            "itemInfo": {
                "ban": "606126",
                "sub": "4035071891",
                "isCrossSell": false,
                "originalIndex": 1,
                "monthlyCost": 20.0,
                "subMarket": "ON"
            }
        },
        {
            "id": "3668d999-3758-4938-9d5b-4d7bcf9fb01d",
            "priority": 2,
            "product": {
                "id": "9147368267313811293",
                "place": [
                    {
                        "id": "13475072",
                        "role": "service address"
                    }
                ]
            },
            "productOffering": {
                "id": "9158868448813733052",
                "name": "SHS Home Bundle Discount",
                "@type": "ProductOfferingRef",
                "@referredType": "ProductOfferingRef",
                "description": [],
                "validFor": {
                    "endDateTime": "2099-12-30T16:00:00Z",
                    "startDateTime": "2020-07-07T17:00:00Z"
                },
                "offeringType": "Promotion"
            },
            "@type": "RecommendationItem",
            "action": "Add",
            "recommendationMessage": [
                {
                    "type": "ProgramDescription",
                    "message": [
                        {
                            "locale": "en_CA",
                            "description": "N/A"
                        }
                    ]
                }
            ],
            "itemInfo": {
                "ban": "606126",
                "sub": "4035071891",
                "isCrossSell": true,
                "originalIndex": 1,
                "subMarket": "ON"
            }
        }
    ],
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        const offerIds = mockedRecommendations.recommendationItem?.map((item: any) => item.product.product?.[0].id).filter((id: string) => id !== undefined)
        const routeClient = new RouteClient({
            projectId: process.env.UNIFORM_PROJECT_ID,
            apiKey: process.env.UNIFORM_API_KEY,
        })

        // this will be retrieved from the recommendation service as well
        const otherParams = {
            price: '199.99',
            term: '36',
        }
        const offerId = offerIds[0];
        const routeData = await routeClient.getRoute({
            path: `/offers/${offerId}?${new URLSearchParams(otherParams).toString()}`,
        })

        res.status(200).json(routeData.compositionApiResponse.composition);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: 'Method not allowed' });
    }
}
