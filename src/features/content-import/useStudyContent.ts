import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import { flashcards as builtInFlashcards } from "../../data/flashcards";
import { units as builtInUnits } from "../../data/units";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import {
  IMPORTED_FLASHCARDS_SETTING_KEY,
  IMPORTED_UNITS_SETTING_KEY,
  mergeById,
  parseStoredFlashcards,
  parseStoredUnits,
} from "./importedContent";

export function useStudyContent() {
  const unitsSetting = useLiveQuery(
    () => studyDatabase.settings.get(IMPORTED_UNITS_SETTING_KEY),
    [],
  );
  const flashcardsSetting = useLiveQuery(
    () => studyDatabase.settings.get(IMPORTED_FLASHCARDS_SETTING_KEY),
    [],
  );

  const importedUnits = useMemo(
    () => parseStoredUnits(unitsSetting?.value),
    [unitsSetting?.value],
  );
  const importedFlashcards = useMemo(
    () => parseStoredFlashcards(flashcardsSetting?.value),
    [flashcardsSetting?.value],
  );

  const units = useMemo(
    () => mergeById(builtInUnits, importedUnits),
    [importedUnits],
  );
  const flashcards = useMemo(
    () => mergeById(builtInFlashcards, importedFlashcards),
    [importedFlashcards],
  );

  return { units, flashcards, importedUnits, importedFlashcards };
}
