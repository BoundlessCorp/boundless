import type { APIRoute } from 'astro';

interface OpportunitySyncBody {
  opportunityId?: string;
  opportunityName?: string;
  estimatedValue?: number | string;
  opportunityStatus?: string;
  pipelineStage?: string;
  leadSource?: string;
  expectedCloseDate?: string;
}

const NOTION_VERSION = '2026-03-11';
const DATABASE_ID = '94a4f01f-ff38-4ceb-9491-17263862d1ed';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const notionToken =
      locals?.runtime?.env?.NOTION_API_KEY ||
      import.meta.env.NOTION_API_KEY;

    if (!notionToken) {
      console.error('Missing NOTION_API_KEY');

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Notion integration is not configured',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = (await request.json()) as OpportunitySyncBody;

    const {
      opportunityId,
      opportunityName,
      estimatedValue,
      opportunityStatus,
      pipelineStage,
      leadSource,
      expectedCloseDate,
    } = body;

    console.log('Received opportunity sync:', {
      opportunityId,
      opportunityName,
      estimatedValue,
      opportunityStatus,
      pipelineStage,
      leadSource,
      expectedCloseDate,
    });

    if (!opportunityId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'opportunityId is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const notionHeaders = {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    };

    // 1. Retrieve the database so we can obtain its data source ID
    const databaseResponse = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}`,
      {
        method: 'GET',
        headers: notionHeaders,
      }
    );

    if (!databaseResponse.ok) {
      const errorText = await databaseResponse.text();

      console.error('Notion database lookup failed:', errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to retrieve Notion database',
          details: errorText,
        }),
        {
          status: databaseResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const database: any = await databaseResponse.json();

    const dataSourceId = database?.data_sources?.[0]?.id;

    if (!dataSourceId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No Notion data source found for DB • Opportunities',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Find the Notion page whose Opportunity ID matches GHL
    const queryResponse = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: 'POST',
        headers: notionHeaders,
        body: JSON.stringify({
          filter: {
            property: 'Opportunity ID',
            rich_text: {
              equals: opportunityId,
            },
          },
          page_size: 1,
        }),
      }
    );

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text();

      console.error('Notion query failed:', errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to query Notion opportunity',
          details: errorText,
        }),
        {
          status: queryResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const queryResult: any = await queryResponse.json();

    const page = queryResult?.results?.[0];

    if (!page?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Matching Notion opportunity was not found',
          opportunityId,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Build only the properties we actually received
    const properties: Record<string, any> = {};

    if (opportunityName) {
      properties['Opportunity Name'] = {
        title: [
          {
            type: 'text',
            text: {
              content: opportunityName,
            },
          },
        ],
      };
    }

    if (
      estimatedValue !== undefined &&
      estimatedValue !== null &&
      estimatedValue !== ''
    ) {
      const numericValue = Number(estimatedValue);

      if (!Number.isNaN(numericValue)) {
        properties['Estimated Value'] = {
          number: numericValue,
        };
      }
    }

    if (opportunityStatus) {
      properties['Opportunity Status'] = {
        select: {
          name: opportunityStatus,
        },
      };
    }

    if (pipelineStage) {
      properties['Pipeline Stage'] = {
        select: {
          name: pipelineStage,
        },
      };
    }

    if (leadSource) {
      properties['Lead Source'] = {
        select: {
          name: leadSource,
        },
      };
    }

    if (expectedCloseDate) {
      properties['Expected Close Date'] = {
        date: {
          start: expectedCloseDate,
        },
      };
    }

    // Always keep the GHL Opportunity ID attached to the record
    properties['Opportunity ID'] = {
      rich_text: [
        {
          type: 'text',
          text: {
            content: opportunityId,
          },
        },
      ],
    };

    // 4. Update the exact matching Notion page
    const updateResponse = await fetch(
      `https://api.notion.com/v1/pages/${page.id}`,
      {
        method: 'PATCH',
        headers: notionHeaders,
        body: JSON.stringify({
          properties,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();

      console.error('Notion page update failed:', errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to update Notion opportunity',
          details: errorText,
        }),
        {
          status: updateResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const updatedPage = await updateResponse.json();

    console.log('Notion opportunity updated:', page.id);

    return new Response(
      JSON.stringify({
        success: true,
        opportunityId,
        notionPageId: page.id,
        updatedPage,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Notion opportunity sync error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details:
          error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
