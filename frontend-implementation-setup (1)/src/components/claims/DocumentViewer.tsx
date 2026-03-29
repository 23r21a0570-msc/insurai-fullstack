import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Download, FileText, Image, File } from 'lucide-react';
import { formatFileSize, formatDate } from '@/utils/formatters';
import type { ClaimDocument } from '@/types';

interface DocumentViewerProps {
  document: ClaimDocument | null;
  onClose: () => void;
}

const getFileIcon = (type: string) => {
  if (type.includes('image')) return Image;
  if (type.includes('pdf')) return FileText;
  return File;
};

const getFileCategory = (type: string) => {
  if (type.includes('image')) return 'Image';
  if (type.includes('pdf')) return 'PDF Document';
  if (type.includes('zip')) return 'Archive';
  return 'File';
};

export const DocumentViewer = ({ document, onClose }: DocumentViewerProps) => {
  const isOpen = !!document;
  const FileIcon = document ? getFileIcon(document.type) : FileText;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl border border-white/[0.10] bg-[#0F1629] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                      <FileIcon size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-sm font-bold text-gray-100">
                        {document?.name}
                      </Dialog.Title>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {document && getFileCategory(document.type)} · {document && formatFileSize(document.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-all"
                      onClick={() => {}}
                    >
                      <Download size={13} />
                      Download
                    </button>
                    <button
                      onClick={onClose}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="p-6">
                  {document?.type.includes('image') ? (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center min-h-[320px]">
                      <div className="text-center text-gray-600">
                        <Image size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Image preview</p>
                        <p className="text-xs mt-1 opacity-60">(Connect to backend to load actual files)</p>
                      </div>
                    </div>
                  ) : document?.type.includes('pdf') ? (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center min-h-[320px]">
                      <div className="text-center text-gray-600">
                        <FileText size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">PDF viewer</p>
                        <p className="text-xs mt-1 opacity-60">(Connect to backend to load actual files)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center min-h-[320px]">
                      <div className="text-center text-gray-600">
                        <File size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Preview not available for this file type</p>
                        <p className="text-xs mt-1 opacity-60">Download the file to view its contents</p>
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {[
                      { label: 'File Type', value: getFileCategory(document?.type ?? '') },
                      { label: 'File Size', value: formatFileSize(document?.size ?? 0) },
                      { label: 'Uploaded', value: document ? formatDate(document.uploadedAt) : '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-sm font-medium text-gray-300">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
