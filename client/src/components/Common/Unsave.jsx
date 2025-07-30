import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const UnsavedChangesAlert = ({
  isOpen,
  setIsOpen,
  title = "Unsaved Changes",
  description = "You have unsaved changes. Do you want to save them or discard?",
  continueEditingLabel = "Continue Editing",
  saveChangesLabel = "Save Changes",
  discardChangesLabel = "Discard Changes",
  onContinueEditing,
  onSaveChanges,
  onDiscardChanges,
  saveButtonProps = { className: "bg-indigo-600 hover:bg-indigo-700 text-white" },
  discardButtonProps = { className: "bg-red-600 hover:bg-red-700 text-white" },
}) => {
  const handleContinueEditing = () => {
    setIsOpen(false);
    if (onContinueEditing) onContinueEditing();
  };

  const handleSaveChanges = () => {
    if (onSaveChanges) onSaveChanges();
    setIsOpen(false);
  };

  const handleDiscardChanges = () => {
    if (onDiscardChanges) onDiscardChanges();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md rounded-lg border shadow-lg">
        <div className="flex items-center gap-4 pb-2">
          <div className="rounded-full bg-amber-50 p-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <AlertDialogHeader className="space-y-1 p-0">
            <AlertDialogTitle className="text-xl font-semibold">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0 pt-4 border-t">
          <AlertDialogAction
            onClick={handleContinueEditing}
            className="mt-0 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {continueEditingLabel}
          </AlertDialogAction>

          <AlertDialogAction
            onClick={handleSaveChanges}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${saveButtonProps.className}`}
          >
            {saveChangesLabel}
          </AlertDialogAction>

          <AlertDialogAction
            onClick={handleDiscardChanges}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${discardButtonProps.className}`}
          >
            {discardChangesLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedChangesAlert;
  