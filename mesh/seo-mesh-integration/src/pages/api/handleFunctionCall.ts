import { type FunctionCallResponse, parseFunctionCall } from '@uniformdev/mesh-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import SeoAnalyzer from 'seo-analyzer';

const appBaseUrl = 'https://mesh-integration-seo.vercel.app';

// The number of checks done by seo-analyzer
const totalChecks = 8;

type SeoAnalyzerResult = { source: string; report: string[] };
type SeoAnalysis = SeoAnalyzerResult & { score: number };

function hasOneHeading1(dom: any) {
  return new Promise((resolve, reject) => {
    const headings = dom.window.document.querySelectorAll('h1');
    if (headings.length === 1) {
      resolve('');
    } else if (headings.length === 0) {
      reject('This page is missing a H1 tag');
    } else {
      reject('This page has more than one H1 tag');
    }
  });
}

const getSeoAnalysis = async (html: string) => {
  return new Promise<SeoAnalysis>((resolve) => {
    new SeoAnalyzer()
      .inputHTMLStrings([
        {
          source: '/',
          text: html,
        },
      ])
      .useRule('titleLengthRule', { min: 10, max: 100 })
      .useRule('metaBaseRule', { names: ['title', 'description'] })
      .useRule('metaSocialRule', {
        properties: [
          // 'og:url',
          // 'og:site_name',
          // 'og:type',
          'og:title',
          'og:description',
          'og:image',
          // 'og:image:width',
          // 'og:image:height',
        ],
      })
      .useRule('imgTagWithAltAttributeRule')
      .useRule(hasOneHeading1)
      // .useRule('aTagWithRelAttributeRule')
      // .useRule('canonicalLinkRule')
      .outputObject((results: SeoAnalyzerResult[]) => {
        const result = results[0] ?? { report: [] };
        const uncappedScore = Math.round(((totalChecks - result.report.length) / totalChecks) * 100);
        const score = Math.min(100, Math.max(0, uncappedScore));

        resolve({
          ...result,
          score,
        });
      })
      .run();
  });
};

const seoAnalysisToResponse = (analysis: SeoAnalysis): FunctionCallResponse => {
  return {
    message: `The full analysis is: ${JSON.stringify(analysis)}`,
    // image: {
    //   url: 'https://seodigitalgroup.com/wp-content/uploads/2019/05/Untitled-design-3.png',
    //   // url: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+CjwhLS0gR2VuZXJhdG9yOiB3aWtpbWVkaWEuc3ZnLmNoYXJ0LCAyMDEzLTA4LTI4IC0tPgo8IS0tIG1vZGlmeSB2aWV3Qm94ICh4LHksZHgsZHkpIGZvciBwb3NpdGlvbiAoeCx5KSBhbmQgc2l6ZSAoZHgsZHkpIC0tPgo8c3ZnIGlkPSJoZWFkIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICB2ZXJzaW9uPSIxLjEiICAgICAKICB2aWV3Qm94PSItMTksLTUzLjUsMTY3LDcxLjUiICAgICAgCiAgd2lkdGg9Ijc1MCIgaGVpZ2h0PSIzMjAiCiAgZm9udC1mYW1pbHk9IkhlbHZldGljYSwgQXJpYWwsIExpYmVyYXRpb24gU2FucyIKPgoKPCEtLSBhbHNvIGEgd29ya2Fyb3VuZCBmb3IgbGlicnN2ZzogYSA8cmVjdD4gbXVzdCBiZSBwbGFjZWQgc29tZXdoZXJlIGJlZm9yZSB0ZXh0IGZvciBhIGdvb2QgZGlzcGxheSBvZiB0ZXh0IC0tPgo8cmVjdCBpZD0iaW1hZ2ViYWNrZ3JvdW5kIiB4PSItMTkiIHk9Ii01My41IiB3aWR0aD0iMTY3IiBoZWlnaHQ9IjcxLjUiIHN0cm9rZS13aWR0aD0iMC4xIiBzdHJva2U9Im5vbmUiIGZpbGw9IndoaXRlIi8+Cgo8dGl0bGU+cGxhaW4gdGV4dCBzdmcgZ3JhcGhpYzwvdGl0bGU+CjxkZXNjPiAgIAogIFRoaXMgc3ZnIGdyYXBoaWMgaXMgdG8gZWRpdCB3aXRoIGFuIHRleHQgZWRpdG9yLgogIFBsZWFzZSBkbyBub3Qgb3ZlcndyaXRlIHRoaXMgZmlsZSBieSBzYXZpbmcgd2l0aCBhbiBpbWFnZSBlZGl0b3IuCjwvZGVzYz4KCjxzdHlsZSBpZD0ic3R5bGVzIiB0eXBlPSJ0ZXh0L2NzcyI+IDwhW0NEQVRBWwogIC5ncmFwaGdlbmVyYWwgeyAgICAgICAgIC8qLS0gZ2VuZXJhbCBsb29rIG9mIGdyYXBocyBhbmQgbWFya2VycywgZS5nLiBpbiBsZWdlbmQgLS0qLwogICAgc3Ryb2tlLXdpZHRoOiAgICAwLjc7CiAgICBmaWxsOiAgICAgICAgICAgIG5vbmU7CiAgICBzdHJva2UtbGluZWpvaW46IHJvdW5kOwogICAgc3Ryb2tlLWxpbmVjYXA6ICByb3VuZDsKICB9CiAgLmdyYXBoZ2VuZXJhbHN0cmV0Y2ggeyAgLyotLSBnZW5lcmFsIGxvb2sgb2YgZ3JhcGhzIGFuZCBtYXJrZXJzIG9uIGEgc3RyZXRjaGVkIGNoYXJ0IC0tKi8gCiAgICBzdHJva2Utd2lkdGg6ICAgIDAuNzsKICAgIGZpbGw6ICAgICAgICAgICAgbm9uZTsKICAgIHN0cm9rZS1saW5lam9pbjogcm91bmQ7CiAgICBzdHJva2UtbGluZWNhcDogIHJvdW5kOwogIH0gCgogIC5ncmFwaDFsaW5lYmxhbmsgeyAvKi0tIGxvb2sgb2YgZ3JhcGggMSAtLSovCiAgICBzdHJva2U6ICAgICAgICAgIHJnYigwMCUsIDAwJSwgNjAlKTsKICB9CiAgLmdyYXBoMWxpbmUgewogICAgc3Ryb2tlOiAgICAgICAgICByZ2IoMDAlLCAwMCUsIDYwJSk7IAogIH0gICAgCgogIC5ncmFwaDJsaW5lYmxhbmsgeyAvKi0tIGxvb2sgb2YgZ3JhcGggMiAtLSovCiAgICBzdHJva2U6ICAgICAgICAgIHJnYig3NSUsIDEwJSwgMTAlKTsKICB9CiAgLmdyYXBoMmxpbmUgewogICAgc3Ryb2tlOiAgICAgICAgICByZ2IoNzUlLCAxMCUsIDEwJSk7IAogIH0gICAgCgogIC5ncmFwaDNsaW5lYmxhbmsgeyAvKi0tIGxvb2sgb2YgZ3JhcGggMyAtLSovCiAgICBzdHJva2U6ICAgICAgICAgIHJnYigwMCUsIDYwJSwgMDAlKTsKICB9CiAgLmdyYXBoM2xpbmUgewogICAgc3Ryb2tlOiAgICAgICAgICByZ2IoMDAlLCA2MCUsIDAwJSk7IAogIH0gIAoKICAuZ3JhcGg0bGluZWJsYW5rIHsgLyotLSBsb29rIG9mIGdyYXBoIDQgLS0qLwogICAgc3Ryb2tlOiAgICAgICAgICByZ2IoMDAlLCA2MCUsIDYwJSk7CiAgfQogIC5ncmFwaDRsaW5lIHsKICAgIHN0cm9rZTogICAgICAgICAgcmdiKDAwJSwgNjAlLCA2MCUpOyAKICB9ICAKCiAgLmdyYXBoNWxpbmVibGFuayB7IC8qLS0gbG9vayBvZiBncmFwaCA1IC0tKi8KICAgIHN0cm9rZTogICAgICAgICAgcmdiKDYwJSwgMDAlLCA2MCUpOwogIH0KICAuZ3JhcGg1bGluZSB7CiAgICBzdHJva2U6ICAgICAgICAgIHJnYig2MCUsIDAwJSwgNjAlKTsgCiAgfSAgCgogIC5ncmFwaDZsaW5lYmxhbmsgeyAvKi0tIGxvb2sgb2YgZ3JhcGggNiAtLSovCiAgICBzdHJva2U6ICAgICAgICAgIHJnYig2MCUsIDYwJSwgMDAlKTsKICB9CiAgLmdyYXBoNmxpbmUgewogICAgc3Ryb2tlOiAgICAgICAgICByZ2IoNjAlLCA2MCUsIDAwJSk7IAogIH0gIAoKICAuZ3JhcGg3bGluZWJsYW5rIHsgLyotLSBsb29rIG9mIGdyYXBoIDcgLS0qLwogICAgc3Ryb2tlOiAgICAgICAgICByZ2IoMDAlLCAwMCUsIDMwJSk7CiAgfQogIC5ncmFwaDdsaW5lIHsKICAgIHN0cm9rZTogICAgICAgICAgcmdiKDAwJSwgMDAlLCAzMCUpOyAKICB9ICAKCiAgLmdyYXBoOGxpbmVibGFuayB7IC8qLS0gbG9vayBvZiBncmFwaCA4IC0tKi8KICAgIHN0cm9rZTogICAgICAgICAgcmdiKDAwJSwgMzAlLCAwMCUpOwogIH0KICAuZ3JhcGg4bGluZSB7CiAgICBzdHJva2U6ICAgICAgICAgIHJnYigwMCUsIDMwJSwgMDAlKTsgCiAgfSAgCiAgLmF4aXNsaW5lIHsKICAgIHN0cm9rZTogICAgICAgICBibGFjazsKICAgIHN0cm9rZS13aWR0aDogICAwLjM1OwogICAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOwogIH0KICAudGl0bGV0ZXh0IHsKICAgIGZvbnQtc2l6ZTogICAgNi42cHg7ICAgICAgIAogIH0KICAuYXhpc3RleHQteCB7CiAgICBmb250LXNpemU6ICAgIDZweDsKICB9CiAgLmF4aXN0ZXh0LXgtbnVtYmVyIHsKICAgIGZvbnQtc2l6ZTogICAgNnB4OwogIH0KICAuYXhpc3RleHQteSB7CiAgICBmb250LXNpemU6ICAgIDZweDsKICB9CiAgLmF4aXNtYXJrLW1haW4gewogICAgc3Ryb2tlOiAgICAgICBibGFjazsKICAgIHN0cm9rZS13aWR0aDogMC4yNTsKICB9CiAgLmF4aXNtYXJrLXNlY29uZCB7CiAgICBzdHJva2U6ICAgICAgIGJsYWNrOwogICAgc3Ryb2tlLXdpZHRoOiAwLjI1OwogIH0gIAogIC5sZWdlbmR0ZXh0IHsKICAgIGZvbnQtc2l6ZTogICAgNnB4OwogICAgdGV4dC1hbmNob3I6ICBzdGFydDsKICB9ICAgCl1dPjwvc3R5bGU+Cgo8ZGVmcz4KICA8IS0tPT0gYXhpcyBkYXNoZXMgZGVmaW5pdGlvbnMgPT0tLT4KICA8IS0tIHgtYXhpcyBtYXJrLCBtb2RpZnkgImhlaWdodCIgLS0+CiAgPHBhdHRlcm4gaWQ9IngtYXhpc21hcmstbWFpbiIgeD0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjIiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPiAKICAgIDxsaW5lIHgxPSIwIiB5MT0iLTEiIHgyPSIwIiB5Mj0iMiIgY2xhc3M9ImF4aXNtYXJrLW1haW4iLz4KICA8L3BhdHRlcm4+CgogIDwhLS0geS1heGlzIG1hcmssIG1vZGlmeSAid2lkdGgiIC0tPgogIDxwYXR0ZXJuIGlkPSJ5LWF4aXNtYXJrLW1haW4iIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxsaW5lIHgxPSItMSIgeTE9IjAiIHgyPSIyIiB5Mj0iMCIgY2xhc3M9ImF4aXNtYXJrLW1haW4iLz4gICAgCiAgPC9wYXR0ZXJuPgoKICA8IS0tIHktYXhpczIgbWFyaywgbW9kaWZ5ICJ3aWR0aCIgLS0+CiAgPHBhdHRlcm4gaWQ9InktYXhpczJtYXJrLW1haW4iIHdpZHRoPSIxIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxsaW5lIHgxPSItMSIgeTE9IjAiIHgyPSIxMSIgeTI9IjAiIGNsYXNzPSJheGlzbWFyay1tYWluIi8+ICAgIAogIDwvcGF0dGVybj4gCjwvZGVmcz4gCgo8ZyB0cmFuc2Zvcm09InNjYWxlKDEsIC0xKSI+ICAKCiAgPCEtLSB4IGF4aXMsIG1vZGlmeSAieDIiIGFuZCAid2lkdGgiIC0tPgogIDxyZWN0IGlkPSJ4LWF4aXNtYXJrIiB4PSItMC41IiB5PSItMS44IiB3aWR0aD0iMTAyIiBoZWlnaHQ9IjEuNzUiIGZpbGw9InVybCgjeC1heGlzbWFyay1tYWluKSIvPgogIDxsaW5lIGlkPSJ4LWF4aXMiIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCIgeTI9IjAiIGNsYXNzPSJheGlzbGluZSIvPgoKICA8IS0tIHkgYXhpcywgbW9kaWZ5ICJoZWlnaHQiIC0tPgogIDxyZWN0IGlkPSJ5LWF4aXNtYXJrIiB4PSItMS43NSIgeT0iLTAuNSIgd2lkdGg9IjEuNzUiIGhlaWdodD0iNTEiIGZpbGw9InVybCgjeS1heGlzbWFyay1tYWluKSIvPgogIDxsaW5lIGlkPSJ5LWF4aXMiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSI1MCIgY2xhc3M9ImF4aXNsaW5lIi8+IAo8L2c+Cgo8IS0tIHggYXhpcyB0ZXh0LCBtb2RpZnkgZWFjaCB2YWx1ZSAtLT4KPGcgaWQ9ImF4aXN0ZXh0LXgiIGNsYXNzPSJheGlzdGV4dC14LW51bWJlciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwgNy44KSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+IAogIDx0ZXh0IHg9ICAiMCI+MDwvdGV4dD4KICA8dGV4dCB4PSAiMTAiPjEwPC90ZXh0PgogIDx0ZXh0IHg9ICIyMCI+MjA8L3RleHQ+CiAgPHRleHQgeD0gIjMwIj4zMDwvdGV4dD4KICA8dGV4dCB4PSAiNDAiPjQwPC90ZXh0PgogIDx0ZXh0IHg9ICI1MCI+NTA8L3RleHQ+CiAgPHRleHQgeD0gIjYwIj42MDwvdGV4dD4KICA8dGV4dCB4PSAiNzAiPjcwPC90ZXh0PgogIDx0ZXh0IHg9ICI4MCI+ODA8L3RleHQ+CiAgPHRleHQgeD0gIjkwIj45MDwvdGV4dD4KICA8dGV4dCB4PSIxMDAiPjEwMDwvdGV4dD4KICA8dGV4dCBpZD0idGl0bGUteCIgY2xhc3M9ImF4aXN0ZXh0LXgiIHg9IjUwIiB5PSI3LjgiID5WYWx1ZXMgb2YgeCBheGlzPC90ZXh0PiAKPC9nPgoKPCEtLSB5IGF4aXMgdGV4dCwgbW9kaWZ5IGVhY2ggdmFsdWUgLS0+CjxnIGlkPSJheGlzdGV4dC15IiBjbGFzcz0iYXhpc3RleHQteSIgdGV4dC1hbmNob3I9ImVuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMsIDEuNSkiPiAKICA8dGV4dCB5PSAgIi0wIj4wPC90ZXh0PgogIDx0ZXh0IHk9ICItMTAiPjEwPC90ZXh0PgogIDx0ZXh0IHk9ICItMjAiPjIwPC90ZXh0PgogIDx0ZXh0IHk9ICItMzAiPjMwPC90ZXh0PgogIDx0ZXh0IHk9ICItNDAiPjQwPC90ZXh0PgogIDx0ZXh0IHk9ICItNTAiPjUwPC90ZXh0PgogIDx0ZXh0IGlkPSJ0aXRsZS15IiB4PSIyNSIgeT0iLTEwLjkiIHRyYW5zZm9ybT0icm90YXRlKC05MCkiIHRleHQtYW5jaG9yPSJtaWRkbGUiID5WYWx1ZXMgb2YgeSBheGlzPC90ZXh0Pgo8L2c+IAoKCjwhLS0gbGVnZW5kIC0tPgo8ZyBpZD0ibGVnZW5kIiBjbGFzcz0ibGVnZW5kdGV4dCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA1LCAtNDUpIj4KCiAgPGcgaWQ9ImxlZ2VuZC1iYWNrZ3JvdW5kIiBjbGFzcz0iYXhpc21hcmstbWFpbiI+CiAgICA8cmVjdCB4PSIwIiB5PSIwIiBmaWxsPSJ3aGl0ZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjE2LjIiLz4KICA8L2c+CiAgPGcgY2xhc3M9ImdyYXBoZ2VuZXJhbCI+PGcgY2xhc3M9ImdyYXBoMWxpbmUiPgogICAgPHBvbHlsaW5lIGlkPSJsZWdlbmQtbGluZTEiIHBvaW50cz0iMiA0LjYyIDcgNC42MiIgbWFya2VyLXN0YXJ0PSJub25lIiBtYXJrZXItZW5kPSJub25lIi8+CiAgPC9nPjwvZz4KICA8dGV4dCBpZD0ibGVnZW5kLXRleHQxIiB4PSI5IiB5PSI2LjQiPjFzdCBXIDwvdGV4dD4gCiAgPGcgY2xhc3M9ImdyYXBoZ2VuZXJhbCI+PGcgY2xhc3M9ImdyYXBoMmxpbmUiPgogICAgPHBvbHlsaW5lIGlkPSJsZWdlbmQtbGluZTIiIHBvaW50cz0iMiAxMS4yMiA3IDExLjIyIiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiLz4KICA8L2c+PC9nPgogIDx0ZXh0IGlkPSJsZWdlbmQtdGV4dDIiIHg9IjkiIHk9IjEzIj4ybmQgVyA8L3RleHQ+CjwvZz4gIAoKPCEtLT09PT09PSBncmFwaCBkYXRhIHdpdGggb3JpZ2luIHZhbHVlcywgeW91IGNhbiBtYW51YWxseSBjb3B5IG9yIGF0dGFjaCB0aGUgdmFsdWVzIGhlcmUgPT09PT09LS0+CjwhLS0gbW9kaWZ5IGRpc3BsYWNlbWVudCAidHJhbnNsYXRlIiAtLT4KPGRlZnM+CjxnIGlkPSJncmFwaHMiPiAgICAgICAgCiAgPCEtLSBncmFwaCAyIC0tPgoKICA8cG9seWxpbmUgaWQ9ImdyYXBoMiIgcG9pbnRzPSIgIAogICAgMjUgNDAgICAKICAgIDQwIDEwCiAgICA1NSAzNQogICAgNzAgMTAKICAgIDg1IDQwIAogICIvPgo8L2c+CjxnIGlkPSJncmFwaDEiPgogIDwhLS0gZ3JhcGggMSAtLT4KICA8cG9seWxpbmUgaWQ9ImdyYXBoMS1saW5lIiBzdHJva2Utd2lkdGg9IjAuNyIgcG9pbnRzPSIgIAogICAgMTUgNDAgICAgCiAgICAzMCAxMAogICAgNDUgMzUKICAgIDYwIDEwCiAgICA3NSA0MAogICIvPgo8L2c+CjwvZGVmcz4KCjxnIGNsYXNzPSJncmFwaGdlbmVyYWxzdHJldGNoIiB0cmFuc2Zvcm09InNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTAsIC0wKSI+IAogIDwhLS0gZ3JhcGggMiAtLT4gCiAgPHVzZSBpZD0iZ3JhcGh1c2UyLTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDApIiBjbGFzcz0iZ3JhcGgybGluZSIgeGxpbms6aHJlZj0iI2dyYXBoMiIvPgogIDwhLS0gZ3JhcGggMSAtLT4gCiAgPHVzZSBpZD0iZ3JhcGh1c2UxLTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIDApIiBjbGFzcz0iZ3JhcGgxbGluZSIgeGxpbms6aHJlZj0iI2dyYXBoMSIvPgo8L2c+Cjwvc3ZnPg==`,
    //   description: 'An image showing the SEO score of the page',
    //   width: 370,
    //   height: 170,
    // },
    inlineIframe: {
      url: `${appBaseUrl}/seo-score?score=${analysis.score}`,
      width: 128,
      height: 128,
      // url: `${appBaseUrl}/chart`,
      // width: 300,
      // height: 320,
      description: `A donut chart showing the score of the analysis: ${analysis.score} out of 100`,
    },
    detailedIframe: {
      url: `${appBaseUrl}/chart`,
      title: 'SEO report',
      buttonLabel: 'View full report',
    },
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<FunctionCallResponse>) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  if (req.method === 'OPTIONS') {
    res.json({ message: '' });
    return;
  }

  const { functionCall, systemParameters } = parseFunctionCall(req);

  if (functionCall.name !== 'get_seo_analysis') {
    res.json({ message: 'No results' });
    return;
  }

  const { pageHtml } = systemParameters;

  if (!pageHtml) {
    res.json({ message: 'No results' });
    return;
  }

  const analysis = await getSeoAnalysis(pageHtml);
  const response = seoAnalysisToResponse(analysis);

  res.json(response);
}
