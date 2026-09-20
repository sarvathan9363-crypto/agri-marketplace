import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
  Trash2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import fileService from '../../services/fileService';
import toast from 'react-hot-toast';

export default function SecureFileUpload({
  documentType = 'OTHER_DOC',
  category = 'VERIFICATION',
  subCategory = 'OTHER',
  entityType = 'VERIFICATION',
  entityId = '',
  acceptedFileTypes = '.pdf,.jpg,.jpeg,.png,.webp',
  maxFileSizeMb = 5,
  label = 'Upload Document',
  description = 'PDF, JPG, JPEG, PNG or WEBP up to 5MB',
  existingFile = null,
  onUploadSuccess = () => {},
  onUploadError = () => {},
  onFileRemove = () => {},
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileAsset, setFileAsset] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize initial existingFile prop
  useEffect(() => {
    if (existingFile) {
      if (typeof existingFile === 'string') {
        setFileAsset({
          secureUrl: existingFile,
          fileName: 'Uploaded Document',
          fileSize: null,
        });
      } else {
        setFileAsset(existingFile);
      }
    }
  }, [existingFile]);

  // Handle Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;

    // Check size limit
    const maxBytes = maxFileSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = `File size exceeds the maximum allowed limit of ${maxFileSizeMb} MB.`;
      setErrorMessage(err);
      toast.error(err);
      return false;
    }

    // Check file extension
    const allowedExts = acceptedFileTypes
      .split(',')
      .map((ext) => ext.trim().toLowerCase());
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(fileExt)) {
      const err = `Unsupported file type (${fileExt}). Allowed formats: ${acceptedFileTypes}`;
      setErrorMessage(err);
      toast.error(err);
      return false;
    }

    return true;
  };

  const processUpload = async (file) => {
    setErrorMessage('');
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const metaData = {
        category,
        subCategory,
        documentType,
        entityType,
        entityId,
        onProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(Math.min(percentCompleted, 95));
        },
      };

      const response = await fileService.uploadFile(file, metaData);

      if (response.success && response.file) {
        setUploadProgress(100);
        setFileAsset(response.file);
        toast.success('Document uploaded securely to Cloudinary!');
        onUploadSuccess(response.file);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      const msg = error.response?.data?.message || error.message || 'File upload failed.';
      setErrorMessage(msg);
      toast.error(msg);
      onUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const handleRemove = async () => {
    if (!fileAsset) return;

    try {
      if (fileAsset._id) {
        await fileService.deleteFile(fileAsset._id);
      }
      setFileAsset(null);
      setErrorMessage('');
      toast.success('Document removed.');
      onFileRemove();
    } catch (error) {
      console.error('Remove file error:', error);
      toast.error('Failed to remove file asset.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span>{label}</span>
          <span className="flex items-center text-xs font-normal text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Cloudinary Protected
          </span>
        </div>
      )}

      {/* State 1: File Uploaded Success Display */}
      {fileAsset ? (
        <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {fileAsset.fileName || 'Uploaded Document'}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Uploaded
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {fileAsset.fileSize && (
                    <span>{formatFileSize(fileAsset.fileSize)}</span>
                  )}
                  {fileAsset.createdAt && (
                    <>
                      <span>•</span>
                      <span>{new Date(fileAsset.createdAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4 shrink-0">
              {fileAsset.secureUrl && (
                <a
                  href={fileAsset.secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-sm transition"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  View
                </a>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-sm transition"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30 shadow-sm transition"
                title="Remove Document"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* State 2: Dropzone & Upload Progress */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-slate-300 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500'
          } ${isUploading ? 'opacity-90 pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="w-full space-y-3 py-2">
              <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm font-semibold">Uploading to Cloudinary...</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {uploadProgress}% complete
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2 rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <span className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Click to choose file
                </span>{' '}
                or drag & drop
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            </>
          )}
        </div>
      )}

      {/* Error display */}
      {errorMessage && (
        <div className="flex items-center text-xs text-red-600 dark:text-red-400 space-x-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
