"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import type { Document } from "@/types";
import { formatDate } from "@/lib/utils/format";
import {
  FolderOpenIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: DocumentTextIcon,
  docx: DocumentTextIcon,
  doc: DocumentTextIcon,
  xlsx: DocumentIcon,
  xls: DocumentIcon,
  jpg: PhotoIcon,
  jpeg: PhotoIcon,
  png: PhotoIcon,
  default: DocumentIcon,
};

function getFileTypeIcon(fileType: string) {
  const Icon = FILE_TYPE_ICONS[fileType.toLowerCase()] || FILE_TYPE_ICONS.default;
  return Icon;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgeBaseClient({
  initialDocuments,
}: {
  initialDocuments: Document[];
}) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const supabase = createClient();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      for (const file of acceptedFiles) {
        try {
          setUploadProgress(`מעלה: ${file.name}...`);
          const fileExt = file.name.split(".").pop() || "bin";
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = `documents/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("knowledge-base")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("knowledge-base")
            .getPublicUrl(filePath);

          const { data: doc, error: dbError } = await supabase
            .from("documents")
            .insert({
              name: file.name,
              file_type: fileExt,
              file_size: file.size,
              file_url: publicUrl,
              tags: [],
            })
            .select()
            .single();

          if (dbError) throw dbError;
          setDocuments((prev) => [doc as Document, ...prev]);
          toast.success(`${file.name} הועלה בהצלחה`);
        } catch (err) {
          console.error(err);
          toast.error(`שגיאה בהעלאת ${file.name}`);
        }
      }
      setUploading(false);
      setUploadProgress("");
    },
    [supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm("למחוק מסמך זה?")) return;
    await supabase.from("documents").delete().eq("id", id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.success("המסמך נמחק");
  };

  const filtered = search
    ? documents.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.description?.toLowerCase().includes(search.toLowerCase()) ||
          d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : documents;

  return (
    <div className="space-y-6">
      {/* Upload dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 hover:border-brand-400 hover:bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        {uploading ? (
          <div>
            <p className="text-base font-medium text-brand-600">מעלה...</p>
            <p className="text-sm text-slate-500 mt-1">{uploadProgress}</p>
          </div>
        ) : isDragActive ? (
          <p className="text-base font-medium text-brand-600">שחרר כאן להעלאה</p>
        ) : (
          <div>
            <p className="text-base font-medium text-slate-700">
              גרור ושחרר קבצים כאן, או לחץ לבחירה
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PDF, Word, Excel, תמונות · עד 50MB לקובץ
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש מסמך..."
            startIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>
        <div className="text-sm text-slate-500 flex items-center">
          {documents.length} מסמכים
        </div>
      </div>

      {/* Documents grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpenIcon className="h-12 w-12" />}
          title="אין מסמכים עדיין"
          description="העלה קטלוגים, תעודות, מחירונים ומידע מוצרים"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((doc) => {
            const Icon = getFileTypeIcon(doc.file_type);
            return (
              <Card key={doc.id} hover padding="sm" className="group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                      >
                        <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id, doc.file_url)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800 line-clamp-2">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="default" className="text-xs">
                        {doc.file_type.toUpperCase()}
                      </Badge>
                      {doc.file_size && (
                        <span className="text-xs text-slate-400">
                          {formatFileSize(doc.file_size)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
