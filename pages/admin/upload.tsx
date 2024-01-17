import React from 'react';

export default function Index() {
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (!event.target.files) return;

        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" accept=".png, .jpg" onChange={handleUpload} />
        </div>
    );
}
