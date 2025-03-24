module.exports = {
  rules: {
    'server-component': {
      create(context) {
        return {
          Program(node) {
            const filename = context.getFilename();
            if (filename.includes('/app/') && !filename.includes('page.tsx')) {
              const sourceCode = context.getSourceCode();
              if (sourceCode.text.includes('use client')) {
                context.report({
                  node,
                  message: 'Server components should not use "use client" directive',
                });
              }
            }
          },
        };
      },
    },
    'client-component': {
      create(context) {
        return {
          Program(node) {
            const filename = context.getFilename();
            if (filename.includes('/components/') && !filename.includes('page.tsx')) {
              const sourceCode = context.getSourceCode();
              if (!sourceCode.text.includes('use client')) {
                context.report({
                  node,
                  message: 'Client components must use "use client" directive',
                });
              }
            }
          },
        };
      },
    },
    'component-structure': {
      create(context) {
        return {
          Program(node) {
            const filename = context.getFilename();
            if (filename.includes('/app/') && filename.includes('page.tsx')) {
              const sourceCode = context.getSourceCode();
              const jsxCount = (sourceCode.text.match(/<[^>]*>/g) || []).length;
              if (jsxCount > 50) {
                context.report({
                  node,
                  message: 'Page components should not contain more than 50 JSX elements. Consider breaking into smaller components.',
                });
              }
            }
          },
        };
      },
    },
  },
}; 