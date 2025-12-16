export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advanced_metrics: {
        Row: {
          bmr: number | null
          body_fat_percentage: number | null
          bone_mass: number | null
          created_at: string | null
          id: string
          measured_at: string | null
          metabolic_age: number | null
          muscle_mass: number | null
          user_id: string
          visceral_fat: number | null
          water_percentage: number | null
        }
        Insert: {
          bmr?: number | null
          body_fat_percentage?: number | null
          bone_mass?: number | null
          created_at?: string | null
          id?: string
          measured_at?: string | null
          metabolic_age?: number | null
          muscle_mass?: number | null
          user_id: string
          visceral_fat?: number | null
          water_percentage?: number | null
        }
        Update: {
          bmr?: number | null
          body_fat_percentage?: number | null
          bone_mass?: number | null
          created_at?: string | null
          id?: string
          measured_at?: string | null
          metabolic_age?: number | null
          muscle_mass?: number | null
          user_id?: string
          visceral_fat?: number | null
          water_percentage?: number | null
        }
        Relationships: []
      }
      ai_chat_history: {
        Row: {
          created_at: string | null
          id: string
          message: string
          message_type: string | null
          response: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          message_type?: string | null
          response?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          message_type?: string | null
          response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      body_measurements: {
        Row: {
          biceps: number | null
          chest: number | null
          created_at: string | null
          height: number | null
          hips: number | null
          id: string
          measured_at: string | null
          thighs: number | null
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          biceps?: number | null
          chest?: number | null
          created_at?: string | null
          height?: number | null
          hips?: number | null
          id?: string
          measured_at?: string | null
          thighs?: number | null
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          biceps?: number | null
          chest?: number | null
          created_at?: string | null
          height?: number | null
          hips?: number | null
          id?: string
          measured_at?: string | null
          thighs?: number | null
          user_id?: string
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      body_photos: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          photo_type: string | null
          photo_url: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          photo_type?: string | null
          photo_url: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          photo_type?: string | null
          photo_url?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      custom_foods: {
        Row: {
          calories: number | null
          carbs: number | null
          category: string | null
          created_at: string | null
          fat: number | null
          id: string
          name: string
          notes: string | null
          portion: string | null
          protein: number | null
          serving_size: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          created_at?: string | null
          fat?: number | null
          id?: string
          name: string
          notes?: string | null
          portion?: string | null
          protein?: number | null
          serving_size?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          created_at?: string | null
          fat?: number | null
          id?: string
          name?: string
          notes?: string | null
          portion?: string | null
          protein?: number | null
          serving_size?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      custom_workouts: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_minutes: number | null
          exercises: Json | null
          id: string
          name: string
          target_muscles: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          name: string
          target_muscles?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          name?: string
          target_muscles?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diet_daily_plans: {
        Row: {
          created_at: string | null
          day_number: number
          diet_program_id: string
          fasting_hours: number | null
          id: string
          is_training_day: boolean | null
          is_weekend: boolean | null
          meals: Json | null
          tips: string[] | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          week_number: number
        }
        Insert: {
          created_at?: string | null
          day_number: number
          diet_program_id: string
          fasting_hours?: number | null
          id?: string
          is_training_day?: boolean | null
          is_weekend?: boolean | null
          meals?: Json | null
          tips?: string[] | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          week_number: number
        }
        Update: {
          created_at?: string | null
          day_number?: number
          diet_program_id?: string
          fasting_hours?: number | null
          id?: string
          is_training_day?: boolean | null
          is_weekend?: boolean | null
          meals?: Json | null
          tips?: string[] | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "diet_daily_plans_diet_program_id_fkey"
            columns: ["diet_program_id"]
            isOneToOne: false
            referencedRelation: "diet_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_programs: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_days: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_days?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_days?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      diet_recipes: {
        Row: {
          calories_per_serving: number | null
          carbs_per_serving: number | null
          cook_time_minutes: number | null
          created_at: string | null
          description: string | null
          diet_tags: string[] | null
          fat_per_serving: number | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: string[] | null
          meal_type: string | null
          name: string
          prep_time_minutes: number | null
          protein_per_serving: number | null
          servings: number | null
        }
        Insert: {
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          cook_time_minutes?: number | null
          created_at?: string | null
          description?: string | null
          diet_tags?: string[] | null
          fat_per_serving?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          meal_type?: string | null
          name: string
          prep_time_minutes?: number | null
          protein_per_serving?: number | null
          servings?: number | null
        }
        Update: {
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          cook_time_minutes?: number | null
          created_at?: string | null
          description?: string | null
          diet_tags?: string[] | null
          fat_per_serving?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          meal_type?: string | null
          name?: string
          prep_time_minutes?: number | null
          protein_per_serving?: number | null
          servings?: number | null
        }
        Relationships: []
      }
      exercise_history: {
        Row: {
          completed_at: string | null
          created_at: string | null
          exercise_id: string | null
          exercise_name: string | null
          id: string
          notes: string | null
          reps: number | null
          sets: number | null
          user_id: string
          weight: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string | null
          exercise_name?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          user_id: string
          weight?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string | null
          exercise_name?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_history_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_library: {
        Row: {
          calories_per_minute: number | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: number | null
          equipment: string | null
          gif_url: string | null
          id: string
          instructions: string[] | null
          muscle_group: string
          name: string
          reps: number | null
          rest_time: number | null
          secondary_muscles: string[] | null
          sets: number | null
          tips: string[] | null
          video_url: string | null
        }
        Insert: {
          calories_per_minute?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          equipment?: string | null
          gif_url?: string | null
          id?: string
          instructions?: string[] | null
          muscle_group: string
          name: string
          reps?: number | null
          rest_time?: number | null
          secondary_muscles?: string[] | null
          sets?: number | null
          tips?: string[] | null
          video_url?: string | null
        }
        Update: {
          calories_per_minute?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          equipment?: string | null
          gif_url?: string | null
          id?: string
          instructions?: string[] | null
          muscle_group?: string
          name?: string
          reps?: number | null
          rest_time?: number | null
          secondary_muscles?: string[] | null
          sets?: number | null
          tips?: string[] | null
          video_url?: string | null
        }
        Relationships: []
      }
      favorite_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_recipes: {
        Row: {
          created_at: string | null
          id: string
          recipe_data: Json | null
          recipe_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_data?: Json | null
          recipe_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_data?: Json | null
          recipe_name?: string
          user_id?: string
        }
        Relationships: []
      }
      hydration_logs: {
        Row: {
          amount_ml: number
          created_at: string | null
          id: string
          logged_at: string | null
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string | null
          id?: string
          logged_at?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string | null
          id?: string
          logged_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hydration_tracking: {
        Row: {
          created_at: string | null
          date: string
          goal_ml: number | null
          id: string
          user_id: string
          water_ml: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          goal_ml?: number | null
          id?: string
          user_id: string
          water_ml?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          goal_ml?: number | null
          id?: string
          user_id?: string
          water_ml?: number | null
        }
        Relationships: []
      }
      macro_tracking: {
        Row: {
          calories_consumed: number | null
          carbs_consumed: number | null
          created_at: string | null
          date: string
          fat_consumed: number | null
          id: string
          meals: Json | null
          protein_consumed: number | null
          user_id: string
        }
        Insert: {
          calories_consumed?: number | null
          carbs_consumed?: number | null
          created_at?: string | null
          date: string
          fat_consumed?: number | null
          id?: string
          meals?: Json | null
          protein_consumed?: number | null
          user_id: string
        }
        Update: {
          calories_consumed?: number | null
          carbs_consumed?: number | null
          created_at?: string | null
          date?: string
          fat_consumed?: number | null
          id?: string
          meals?: Json | null
          protein_consumed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          fat: number | null
          id: string
          ingredients: Json | null
          logged_at: string | null
          meal_type: string | null
          name: string
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          id?: string
          ingredients?: Json | null
          logged_at?: string | null
          meal_type?: string | null
          name: string
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          id?: string
          ingredients?: Json | null
          logged_at?: string | null
          meal_type?: string | null
          name?: string
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          achievement_notifications: boolean | null
          created_at: string | null
          hydration_interval_minutes: number | null
          hydration_reminder_enabled: boolean | null
          hydration_reminder_interval: number | null
          hydration_reminders: boolean | null
          id: string
          meal_reminder_enabled: boolean | null
          meal_reminder_times: string[] | null
          meal_reminders: boolean | null
          motivation_reminder_enabled: boolean | null
          motivation_reminder_time: string | null
          photo_reminder_day: string | null
          photo_reminder_enabled: boolean | null
          progress_photo_reminder_enabled: boolean | null
          push_subscription: Json | null
          updated_at: string | null
          user_id: string
          weigh_in_reminder_day: string | null
          weigh_in_reminder_enabled: boolean | null
          weigh_in_reminder_time: string | null
          weight_reminder_day: string | null
          weight_reminder_enabled: boolean | null
          weight_reminder_time: string | null
          workout_reminder_days: string[] | null
          workout_reminder_enabled: boolean | null
          workout_reminder_time: string | null
          workout_reminders: boolean | null
        }
        Insert: {
          achievement_notifications?: boolean | null
          created_at?: string | null
          hydration_interval_minutes?: number | null
          hydration_reminder_enabled?: boolean | null
          hydration_reminder_interval?: number | null
          hydration_reminders?: boolean | null
          id?: string
          meal_reminder_enabled?: boolean | null
          meal_reminder_times?: string[] | null
          meal_reminders?: boolean | null
          motivation_reminder_enabled?: boolean | null
          motivation_reminder_time?: string | null
          photo_reminder_day?: string | null
          photo_reminder_enabled?: boolean | null
          progress_photo_reminder_enabled?: boolean | null
          push_subscription?: Json | null
          updated_at?: string | null
          user_id: string
          weigh_in_reminder_day?: string | null
          weigh_in_reminder_enabled?: boolean | null
          weigh_in_reminder_time?: string | null
          weight_reminder_day?: string | null
          weight_reminder_enabled?: boolean | null
          weight_reminder_time?: string | null
          workout_reminder_days?: string[] | null
          workout_reminder_enabled?: boolean | null
          workout_reminder_time?: string | null
          workout_reminders?: boolean | null
        }
        Update: {
          achievement_notifications?: boolean | null
          created_at?: string | null
          hydration_interval_minutes?: number | null
          hydration_reminder_enabled?: boolean | null
          hydration_reminder_interval?: number | null
          hydration_reminders?: boolean | null
          id?: string
          meal_reminder_enabled?: boolean | null
          meal_reminder_times?: string[] | null
          meal_reminders?: boolean | null
          motivation_reminder_enabled?: boolean | null
          motivation_reminder_time?: string | null
          photo_reminder_day?: string | null
          photo_reminder_enabled?: boolean | null
          progress_photo_reminder_enabled?: boolean | null
          push_subscription?: Json | null
          updated_at?: string | null
          user_id?: string
          weigh_in_reminder_day?: string | null
          weigh_in_reminder_enabled?: boolean | null
          weigh_in_reminder_time?: string | null
          weight_reminder_day?: string | null
          weight_reminder_enabled?: boolean | null
          weight_reminder_time?: string | null
          workout_reminder_days?: string[] | null
          workout_reminder_enabled?: boolean | null
          workout_reminder_time?: string | null
          workout_reminders?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          avatar_url: string | null
          created_at: string | null
          daily_calories_goal: number | null
          daily_carbs_goal: number | null
          daily_fat_goal: number | null
          daily_protein_goal: number | null
          fitness_goal: string | null
          gender: string | null
          goal_weight: number | null
          height: number | null
          id: string
          is_premium: boolean | null
          name: string | null
          onboarding_completed: boolean | null
          trial_expired: boolean | null
          trial_started_at: string | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          daily_calories_goal?: number | null
          daily_carbs_goal?: number | null
          daily_fat_goal?: number | null
          daily_protein_goal?: number | null
          fitness_goal?: string | null
          gender?: string | null
          goal_weight?: number | null
          height?: number | null
          id?: string
          is_premium?: boolean | null
          name?: string | null
          onboarding_completed?: boolean | null
          trial_expired?: boolean | null
          trial_started_at?: string | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          daily_calories_goal?: number | null
          daily_carbs_goal?: number | null
          daily_fat_goal?: number | null
          daily_protein_goal?: number | null
          fitness_goal?: string | null
          gender?: string | null
          goal_weight?: number | null
          height?: number | null
          id?: string
          is_premium?: boolean | null
          name?: string | null
          onboarding_completed?: boolean | null
          trial_expired?: boolean | null
          trial_started_at?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          keys: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          keys?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          keys?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          shared_count: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          shared_count?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          shared_count?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_diet_enrollments: {
        Row: {
          created_at: string | null
          current_day: number | null
          diet_program_id: string
          id: string
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_day?: number | null
          diet_program_id: string
          id?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_day?: number | null
          diet_program_id?: string
          id?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_diet_enrollments_diet_program_id_fkey"
            columns: ["diet_program_id"]
            isOneToOne: false
            referencedRelation: "diet_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_goals: {
        Row: {
          created_at: string | null
          current_weight: number | null
          id: string
          target_date: string | null
          target_weight: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_weight?: number | null
          id?: string
          target_date?: string | null
          target_weight?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_weight?: number | null
          id?: string
          target_date?: string | null
          target_weight?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workout_history: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          exercises_completed: Json | null
          id: string
          user_id: string
          workout_id: string | null
          workout_name: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          exercises_completed?: Json | null
          id?: string
          user_id: string
          workout_id?: string | null
          workout_name?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          exercises_completed?: Json | null
          id?: string
          user_id?: string
          workout_id?: string | null
          workout_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_history_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_minutes: number | null
          exercises_data: Json | null
          id: string
          image_url: string | null
          is_public: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises_data?: Json | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises_data?: Json | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
