import { useState, useEffect } from 'react';
import { getStoredSectionsData, type PortfolioSectionsData, SECTIONS_STORAGE_KEY } from '@/data/sectionsContent';

export function useSectionContent() {
  const [sections, setSections] = useState<PortfolioSectionsData>(getStoredSectionsData);

  useEffect(() => {
    const handleUpdate = () => {
      setSections(getStoredSectionsData());
    };

    window.addEventListener('section-content-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('section-content-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateSectionMeta = (key: keyof PortfolioSectionsData, data: any) => {
    try {
      const current = getStoredSectionsData();
      const updated = {
        ...current,
        [key]: typeof data === 'object' ? { ...(current[key] as any), ...data } : data,
      };
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(updated));
      setSections(updated);
      window.dispatchEvent(new Event('section-content-updated'));
    } catch (e) {
      console.error('Failed to update section content:', e);
    }
  };

  const resetAllSections = () => {
    try {
      localStorage.removeItem(SECTIONS_STORAGE_KEY);
      const defaults = getStoredSectionsData();
      setSections(defaults);
      window.dispatchEvent(new Event('section-content-updated'));
    } catch (e) {
      console.error('Failed to reset sections:', e);
    }
  };

  return {
    sections,
    updateSectionMeta,
    resetAllSections,
  };
}
