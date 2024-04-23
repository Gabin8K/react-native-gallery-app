import { File } from '@/utils/type';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY!!;

const supabase = createClient(supabaseUrl, supabaseKey);


export async function uploadFile(files: File[]) {
  const bucket = (await supabase.storage.getBucket('files'));
  if (!bucket.data) {
    (await supabase.storage.createBucket('files'));
  }
  for (let file of files) {
    const name = file.name.split('.')[0] + Date.now() + '.' + file.name.split('.').pop();
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name,
      type: file.mimeType ?? 'image/jpeg'
    } as any);
    const { data, error } = await supabase.storage.from('files').upload(name, formData);
    if (!data) {
      throw new Error(error.message);
    }
  }
}


export async function deleteFile(files: File[]) {
  const paths = files.map(file => file.name);
  const { error } = await supabase.storage.from('files').remove(paths);
  if (error) {
    throw new Error(error.message);
  }
}


export async function fetchFiles() {
  const files: File[] = [];
  const { data, error } = await supabase.storage.from('files')
    .list();
  if (error) {
    throw new Error(error.message);
  }
  for (const file of data) {
    const { data } = await supabase.storage.from('files').getPublicUrl(file.name)
    if (error || !data) {
      throw new Error('Failed to get public url');
    }
    files.push({
      ...file,
      name: file.name,
      mimeType: file.metadata.mimeType ?? 'image/jpeg',
      size: file.metadata.size,
      lastModified: new Date(file.last_accessed_at).getTime(),
      uri: data.publicUrl
    })
  }
  return files;
}

export default supabase;