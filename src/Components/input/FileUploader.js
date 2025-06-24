import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DragAndDropUploader = ({ onChange, inputName, value }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState();
  console.log(value, "value in file uploader");
  const [error, setError] = useState(null);
  useEffect(() => {
    // Check if value has a file for the inputNamei
    if (typeof value === "string") {
      // If value is a string, it might be a URL or path, set it as the preview
      setFilePreview(value);
      setSelectedFile(value); // Clear selected file if it's a URL
      return;
    }
  }, [value]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Only image files are allowed (e.g., .png, .jpg, .jpeg).");
      return;
    }

    setSelectedFile(file);
    setError(null); // Clear previous errors

    // Generate a preview for the image
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result); // Data URL for the image
    };
    reader.readAsDataURL(file);

    // Trigger onChange callback
    onChange((prev) => ({
      ...prev,
      [inputName]: file,
    }));
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);

    // Clear file in parent state
    onChange((prev) => ({
      ...prev,
      [inputName]: null,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Allow only one file
    accept: "image/*", // Show only image files in file picker
  });

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-dashed flex flex-col items-center justify-center rounded-lg h-full p-6 text-center transition-all ${
        isDragActive ? "bg-secondary text-mainColor" : "bg-white text-textColor"
      }`}
      style={{
        borderColor: "#3c9d8d", // Main color
        color: isDragActive ? "#3c9d8d" : "#313144", // Text color
      }}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <div
          className="flex flex-col items-center justify-center w-full h-full p-4 bg-secondary rounded-lg cursor-pointer"
          onDoubleClick={removeFile}
          style={{
            border: "1px solid #3c9d8d",
            color: "#313144",
          }}
        >
          {filePreview && (
            <Image
              src={filePreview}
              width={128}
              height={128}
              alt="Preview"
              className="object-cover rounded-md"
            />
          )}
          <p className="text-sm text-textColor mt-2">Double-click to remove</p>
        </div>
      ) : isDragActive ? (
        <p className="font-bold">Drop the logo here...</p>
      ) : (
        <p className="font-bold">
          Drag & drop your logo here, or click to select an image
        </p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default DragAndDropUploader;
