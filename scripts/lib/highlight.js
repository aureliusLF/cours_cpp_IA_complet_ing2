(function initialiseCourseAppHighlight(globalScope) {
  const { escapeHtml } = globalScope.CourseAppStrings || {};

  function normaliseCodeLanguage(language) {
    const normalised = String(language || "")
      .trim()
      .toLowerCase();

    const aliases = {
      "c++": "cpp",
      sh: "bash",
      shell: "bash",
      plaintext: "text"
    };

    return aliases[normalised] || normalised || "text";
  }

  function languagePatterns(language) {
    const patternsByLanguage = {
      cpp: [
        { className: "token-comment", regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y },
        { className: "token-string", regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y },
        { className: "token-preprocessor", regex: /#[^\n]*/y },
        { className: "token-number", regex: /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:u|U|l|L|ll|LL|f|F)*)\b/y },
        {
          className: "token-keyword",
          regex: /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|concept|const|consteval|constexpr|constinit|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|requires|return|short|signed|sizeof|static|struct|switch|template|this|throw|true|try|typedef|typename|union|unsigned|using|virtual|void|volatile|while)\b/y
        },
        {
          className: "token-type",
          regex: /\b(?:std|size_t|string|string_view|vector|array|list|deque|map|set|unordered_map|unordered_set|optional|variant|unique_ptr|shared_ptr|weak_ptr|ifstream|ofstream|fstream|istream|ostream|cout|cin|cerr|endl)\b/y
        },
        { className: "token-function", regex: /\b[A-Za-z_]\w*(?=\s*\()/y },
        { className: "token-operator", regex: /::|->\*|->|<<=|>>=|<<|>>|<=|>=|==|!=|\+\+|--|&&|\|\||[+\-*/%&|^~!=<>?:]+/y },
        { className: "token-punctuation", regex: /[{}()[\],.;]/y }
      ],
      bash: [
        { className: "token-comment", regex: /#[^\n]*/y },
        { className: "token-string", regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y },
        { className: "token-variable", regex: /\$(?:\{[^}]+\}|[A-Za-z_][A-Za-z0-9_]*|\d+|[@*?#$!_\-])/y },
        {
          className: "token-keyword",
          regex: /\b(?:if|then|else|elif|fi|for|in|do|done|case|esac|while|until|function|select)\b/y
        },
        { className: "token-command", regex: /\b(?:g\+\+|cmake|make|mkdir|cd|echo|cat|grep|find|ls|pwd|ar|export)\b/y },
        { className: "token-number", regex: /\b\d+\b/y },
        { className: "token-operator", regex: /\|\||&&|>>|<<|[|=]/y },
        { className: "token-punctuation", regex: /[(){}[\];]/y },
        { className: "token-constant", regex: /--?[A-Za-z0-9][A-Za-z0-9-]*/y }
      ],
      cmake: [
        { className: "token-comment", regex: /#[^\n]*/y },
        { className: "token-string", regex: /"(?:\\.|[^"\\])*"/y },
        { className: "token-variable", regex: /\$\{[^}]+\}/y },
        {
          className: "token-keyword",
          regex: /\b(?:cmake_minimum_required|project|set|add_executable|add_library|target_include_directories|target_link_libraries|target_compile_features|target_compile_options|find_package|include_directories|if|else|elseif|endif|foreach|endforeach|while|endwhile|message)\b/y
        },
        {
          className: "token-constant",
          regex: /\b(?:PUBLIC|PRIVATE|INTERFACE|REQUIRED|CONFIG|ON|OFF|TRUE|FALSE|CMAKE_CXX_STANDARD|CMAKE_CXX_STANDARD_REQUIRED)\b/y
        },
        { className: "token-number", regex: /\b\d+\b/y },
        { className: "token-punctuation", regex: /[()]/y }
      ],
      text: []
    };

    return patternsByLanguage[language] || patternsByLanguage.text;
  }

  function highlightSource(source, language) {
    const patterns = languagePatterns(language);
    if (patterns.length === 0) {
      return escapeHtml(source);
    }

    let index = 0;
    let highlighted = "";

    while (index < source.length) {
      let matched = false;

      for (const pattern of patterns) {
        pattern.regex.lastIndex = index;
        const match = pattern.regex.exec(source);
        if (!match) {
          continue;
        }

        highlighted += `<span class="token ${pattern.className}">${escapeHtml(match[0])}</span>`;
        index = pattern.regex.lastIndex;
        matched = true;
        break;
      }

      if (!matched) {
        highlighted += escapeHtml(source[index]);
        index += 1;
      }
    }

    return highlighted;
  }

  function highlightCodeBlocks(root) {
    const scope = root || document;
    if (!scope || typeof scope.querySelectorAll !== "function") {
      return;
    }

    const codeBlocks = scope.querySelectorAll(".code-block code[data-language]");

    codeBlocks.forEach((codeElement) => {
      const language = normaliseCodeLanguage(codeElement.dataset.language);
      const source = codeElement.textContent || "";
      codeElement.innerHTML = highlightSource(source, language);
      codeElement.dataset.highlighted = "true";
    });
  }

  globalScope.CourseAppHighlight = {
    highlightCodeBlocks
  };
})(window);
