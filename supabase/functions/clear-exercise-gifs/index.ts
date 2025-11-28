import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🗑️ Starting storage cleanup...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });

    // Step 1: List all files in the bucket with pagination
    console.log('📁 Listing all files in exercise-gifs bucket...');
    
    let allFiles: any[] = [];
    let offset = 0;
    const limit = 1000;
    
    while (true) {
      const { data: files, error: listError } = await supabase.storage
        .from('exercise-gifs')
        .list('', {
          limit: limit,
          offset: offset,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Error listing files:', listError);
        throw listError;
      }

      if (!files || files.length === 0) break;
      
      allFiles = [...allFiles, ...files];
      console.log(`📥 Fetched ${files.length} files (total: ${allFiles.length})`);
      
      if (files.length < limit) break;
      offset += limit;
    }

    console.log(`📊 Found ${allFiles.length} total files`);

    if (allFiles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Storage já está vazio',
          stats: {
            deleted: 0,
            total: 0
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Step 2: Delete all files in batches
    console.log(`🗑️ Deleting ${allFiles.length} files...`);
    
    const filePaths = allFiles.map(file => file.name);
    let deletedCount = 0;
    let failedCount = 0;
    const batchSize = 100;

    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      
      const { data, error } = await supabase.storage
        .from('exercise-gifs')
        .remove(batch);

      if (error) {
        console.error(`Error deleting batch ${i / batchSize + 1}:`, error);
        failedCount += batch.length;
      } else {
        deletedCount += batch.length;
        console.log(`✅ Deleted batch ${i / batchSize + 1} (${batch.length} files)`);
      }
    }

    console.log(`🎉 Cleanup complete! Deleted: ${deletedCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Storage limpo com sucesso!`,
        stats: {
          deleted: deletedCount,
          failed: failedCount,
          total: allFiles.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in clear-exercise-gifs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
