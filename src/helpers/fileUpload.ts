export const fileUpload = async (file: File | null): Promise<string | null> => {
    // Si no hay archivo, retornamos null
    if (!file) return null;

    const cloudUrl = 'https://api.cloudinary.com/v1_1/ma-cloud/upload';

    const formData = new FormData();
    formData.append('upload_preset', 'react-trellify');
    formData.append('file', file);

    try {
        const resp = await fetch(cloudUrl, {
            method: 'POST',
            body: formData
        });

        if (!resp.ok) throw new Error('No se pudo subir imagen');

        const cloudResp = await resp.json();

        // Retornamos la URL segura del archivo subido
        return cloudResp.secure_url;

    } catch (error) {
        // En caso de error, retornamos null
        return null;
    }
};
