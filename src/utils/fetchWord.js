export async function fetchWord() {
    try {
      const response = await fetch("/daily-word.json");
      if (!response.ok) {
        throw new Error("Failed to fetch word");
      }
      const data = await response.json();
      return data.word;
    } catch (error) {
      console.error("Error fetching word:", error);
      return null;
    }
  }
  