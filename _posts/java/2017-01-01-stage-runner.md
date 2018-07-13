StageRunner

# Automated Stage testing with Coverage Consolidation (ASCC)

## Abstract:

The current process for stage testing across PaaS product family involves manual regress execution, aggregating code coverage from multiple regress suites, globalization regress execution for multiple locales, dif analysis followed by sapphire upload. The article proposes a process to centralize and automate the workflow for stage testing. The component teams shall involve only analyzing new failures.  

## Detailed Description  

### Current Overhead

*   Stage testing manual, repetitive and monotonous.  
    
*   At least two person-day, every week (stage announcement frequency) from each product QA team is dedicated for stage testing and coverage report generation alone.
*   Component labels selected for the stage shall lag behind compared to nightly builds. Known issues shall recur during stage testing.  
    

### RM uses ASCC to trigger stage announcements  

ASCC can have a UI for RM to publish the stage shiphomes.Once announced, the details shall be published in the Wiki and shall also be available as a JSON object that can be readily consumed using a REST request.  
  

### How ASCC Works?

*   ASCC shall submit jobs to be run in parallel and capture coverage.  
    
*   ASCC shall email QA regarding the job submissions for the new stage. QA can visually monitor progress of the jobs submitted.  
    
*   ASCC shall poll for all jobs to complete, consolidate the coverage dump from each job and generate an unified coverage report.
*   ASCC shall verify the regress results with pre-configured acceptable range, pre-configured dif analysis, auto upload the qualifying suite results to sapphire and notify QA by email.
*   QA can work on any failing suites or unexpected difs.
*   ASCC can optionally file test bugs based on configured dif grouping patterns. Grouping patterns shall be used to group a set of related difs and file bug for each group.
*   QA shall work on fixing the test bugs or marking them as potential product bugs.

### What does ASCC accomplish?

*   ASCC shall make stage shiphome details available as a ReST resource to be consumed by any tool (Including ASCC itself)
*   ASCC shall automate manual and repetitive job of stage regress execution, coverage execution and consolidation and result publishing. For example, in case of OTD, with 6 regress suites, 20 man-hours per week was saved.  
    
*   QA can focus automation rather than manual stage execution.  
    

## Novelty Value

*   Eliminating the manual and repetitive task of stage testing and coverage consolidation shall provide more quality time for QA to focus on automation.