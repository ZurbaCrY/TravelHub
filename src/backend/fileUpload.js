import { SUPABASE_URL} from '@env';

export const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const firstAsset = result.assets[0];
        const fileUri = firstAsset.uri;
        const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);

        const response = await fetch(fileUri);
        const blob = await response.blob();

        const { error } = await supabase.storage.from('Storage').upload(`images/${fileName}`, blob, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          throw error;
        }

        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/Storage/images/${fileName}`;
        console.log('Image URL:', imageUrl);
      }
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error.message);
    }
  };