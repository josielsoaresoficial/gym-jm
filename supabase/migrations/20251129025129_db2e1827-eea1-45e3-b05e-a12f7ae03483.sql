-- Recategorizar exercícios de antebraço que estão incorretamente como bíceps
UPDATE exercise_library
SET muscle_group = 'antebraco'
WHERE name ILIKE '%punho%' 
   OR name ILIKE '%wrist%'
   OR name ILIKE '%forearm%'
   OR name ILIKE '%antebraço%'
   OR name ILIKE '%antebraco%';