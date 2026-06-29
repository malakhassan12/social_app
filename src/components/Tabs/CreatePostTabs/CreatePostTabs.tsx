import PreviewsFiles from "@/app/(user)/create-post/_components/previewsFiles";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilesUpload } from "@/lib/upload/post/uploadFiles";
import { Image, Video, Upload } from "lucide-react";

const CreatePostTabs = () => {
  const { previews, imageRef , videoRef, handleFilesChange, removeFile } =
    useFilesUpload();
  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mt-3">
        <PreviewsFiles previews={previews} removeFile={removeFile} />
      </div>
      <Tabs defaultValue="text" className="mt-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="text">✏️ Text</TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <Image className="h-3.5 w-3.5" /> Image
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-1">
            <Video className="h-3.5 w-3.5" /> Video
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
            Write your thoughts and share with the world
          </p>
        </TabsContent>

        <TabsContent value="image" className="mt-2">
          <Field>
            <FieldLabel htmlFor="picture">Picture</FieldLabel>
            <div className="relative">
              <Input
                ref={imageRef}
                id="picture"
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => handleFilesChange(e, "image")}
                className="w-full border-dashed border-2 py-8 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer file:hidden"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-gray-400">
                <Upload className="h-5 w-5" />
                <span className="text-sm">Upload Image</span>
              </div>
            </div>
            <FieldDescription className="text-gray-400 text-sm">
              PNG, JPG, WEBP up to 5MB
            </FieldDescription>
          </Field>
        </TabsContent>

        <TabsContent value="video" className="mt-2">
          <Field>
            <FieldLabel htmlFor="video">Video</FieldLabel>
            <div className="relative">
              <Input
                id="video"
                type="file"
                name="videos"
                accept="video/*"
                ref={videoRef}
                multiple
                className="w-full border-dashed border-2 py-8 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer file:hidden"
                onChange={(e) => handleFilesChange(e, "video")}
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-gray-400">
                <Upload className="h-5 w-5" />
                <span className="text-sm">Upload Video</span>
              </div>
            </div>
            <FieldDescription className="text-gray-400 text-sm">
              MP4, WebM, MOV up to 50MB
            </FieldDescription>
          </Field>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CreatePostTabs;
