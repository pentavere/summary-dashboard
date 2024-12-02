"use client";
import ModifyDocuments from '@/components/pages/ModifyDocuments';

export default function ModifyDocumentsPage() {
  const documents = [{"title": "Document", "datetime": "2022"}];
  
  return <ModifyDocuments documents={documents} />;
}