import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Optional: for icons

interface Developer {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  location: string;
}

interface Props {
  developer: Developer;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
  isOwner: boolean;
}

export const DeveloperCard: React.FC<Props> = ({
  developer,
  onEdit,
  onDelete,
  isAdmin,
  isOwner,
}) => {
  return (
    <div className="bg-white border rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <h2 className="text-2xl font-semibold text-blue-800 mb-1">{developer.name}</h2>
      <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Email:</span> {developer.email}</p>
      <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Skills:</span> {developer.skills.join(', ')}</p>
      <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Experience:</span> {developer.experience}</p>
      <p className="text-gray-600 text-sm mb-4"><span className="font-medium">Location:</span> {developer.location}</p>

      {(isOwner || isAdmin) && (
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          {isAdmin && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
