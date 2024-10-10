export function getPageContent(callback: (content: string) => void): void {
    // Helper function to collect text from a document or ShadowRoot, including Shadow DOM
    function collectTextFromDocument(doc: Document | ShadowRoot): string {
        let text = '';

        // Collect text from the main document body
        if (doc instanceof Document && doc.body) {
            text += doc.body.textContent || '';
        }

        // Function to recursively collect text from Shadow DOM elements
        function collectTextFromShadowRoots(element: Element): string {
            let shadowText = '';

            // If the element has a Shadow Root, collect text from it
            if (element.shadowRoot) {
                shadowText += collectTextFromDocument(element.shadowRoot);
            }

            // Recursively collect text from the element's children
            Array.from(element.children).forEach(child => {
                shadowText += collectTextFromShadowRoots(child);
            });

            return shadowText;
        }

        // Traverse all elements to find Shadow DOMs and collect text
        const elements = doc.querySelectorAll('*');
        elements.forEach(element => {
            text += collectTextFromShadowRoots(element);
        });

        return text;
    }

    // Helper function to collect text from iframes recursively
    function collectTextFromIframes(doc: Document, collectedTexts: string[]): void {
        const iframes = doc.getElementsByTagName('iframe');

        for (let i = 0; i < iframes.length; i++) {
            try {
                const iframe = iframes[i];
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    collectedTexts.push(collectTextFromDocument(iframeDoc));
                    collectTextFromIframes(iframeDoc, collectedTexts);
                }
            } catch (e) {
                // Can't access cross-origin iframes
                console.warn('Cannot access iframe due to cross-origin policy:', e);
            }
        }
    }

    // Main function to collect all text content
    function collectAllText(): string {
        const collectedTexts: string[] = [];
        collectedTexts.push(collectTextFromDocument(document));
        collectTextFromIframes(document, collectedTexts);

        // Combine all collected texts
        const fullText = collectedTexts.join(' ');
        return fullText;
    }

    // Function to handle dynamic content using MutationObserver
    function observeDynamicContent(): void {
        let timeoutId: number | null = null;

        const observer = new MutationObserver((mutations, obs) => {
            // Wait a fixed time after each mutation
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(() => {
                const fullText = collectAllText();
                callback(fullText);
            }, 1000); // Adjust the timeout as needed
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        }

        // Initial content collection
        const initialText = collectAllText();
        callback(initialText);
    }

    // Start observing dynamic content
    observeDynamicContent();
}
