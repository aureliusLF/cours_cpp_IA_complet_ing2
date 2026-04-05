(function assembleCourseData(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est bien chargé avant scripts/course-data.js.");
  return;
}

const { stripHtml, normaliseForSearch } = registry.helpers;
const courseMeta = registry.getCourseMeta();
const roadmap = registry.getRoadmap();
const glossary = registry.getGlossary();
const bundles = registry.getChapterBundles();

const chapters = bundles
  .slice()
  .sort((left, right) => left.order - right.order)
  .map((bundle, index) => {
    const chapter = bundle.chapter || {};
    const enrichedBody = registry.injectLessonDeepDives(
      chapter.body || "",
      bundle.deepDives || []
    );

    return Object.assign({}, chapter, {
      body: enrichedBody,
      order: index + 1,
      searchText: normaliseForSearch([
        chapter.title,
        chapter.shortTitle,
        chapter.summary,
        chapter.track,
        chapter.level,
        Array.isArray(chapter.goals) ? chapter.goals.join(" ") : "",
        Array.isArray(chapter.checklist) ? chapter.checklist.join(" ") : "",
        Array.isArray(chapter.keywords) ? chapter.keywords.join(" ") : "",
        stripHtml(enrichedBody),
        Array.isArray(chapter.exercises)
          ? chapter.exercises.map((exercise) => `${exercise.title} ${exercise.prompt}`).join(" ")
          : ""
      ].join(" "))
    });
  });

globalScope.COURSE_DATA = {
  courseMeta,
  roadmap,
  glossary,
  chapters
};
})(window);
