-- World Cup 2026 Database Schema
-- Created: 2024-11-18

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table (48 teams for World Cup 2026)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country_code CHAR(3) NOT NULL UNIQUE, -- ISO 3166-1 alpha-3
    flag_url TEXT,
    confederation VARCHAR(20) NOT NULL, -- AFC, CAF, CONCACAF, CONMEBOL, OFC, UEFA
    fifa_ranking INTEGER,
    group_letter CHAR(1), -- A-L for group stage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(20) NOT NULL, -- GK, DF, MF, FW
    jersey_number INTEGER,
    age INTEGER,
    club VARCHAR(100),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, jersey_number)
);

-- Venues table (stadiums)
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    capacity INTEGER,
    timezone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_team_id UUID REFERENCES teams(id),
    away_team_id UUID REFERENCES teams(id),
    venue_id UUID REFERENCES venues(id),
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    stage VARCHAR(20) NOT NULL, -- group, round_16, quarter, semi, final
    group_letter CHAR(1), -- Only for group stage matches
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, finished, postponed
    attendance INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match events (goals, cards, substitutions)
CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id),
    team_id UUID REFERENCES teams(id),
    event_type VARCHAR(20) NOT NULL, -- goal, yellow_card, red_card, substitution
    minute INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles/News content
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(100),
    featured_image_url TEXT,
    category VARCHAR(50), -- news, analysis, preview, recap
    tags TEXT[], -- Array of tags
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User predictions/quinielas
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Will reference auth.users
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    home_score_prediction INTEGER NOT NULL,
    away_score_prediction INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, match_id)
);

-- User profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    favorite_team_id UUID REFERENCES teams(id),
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- match_start, goal, result, news
    read BOOLEAN DEFAULT false,
    match_id UUID REFERENCES matches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teams_country_code ON teams(country_code);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);
CREATE INDEX idx_match_events_match_id ON match_events(match_id);
CREATE INDEX idx_articles_published ON articles(published, published_at);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, read);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public read access for basic data
CREATE POLICY "Public read access for teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access for players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access for venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read access for matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access for match events" ON match_events FOR SELECT USING (true);

-- Articles: public read for published, authenticated write
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (published = true);
CREATE POLICY "Authenticated users can create articles" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own articles" ON articles FOR UPDATE USING (auth.uid()::text = author);

-- User profiles: users can read all, update own
CREATE POLICY "Public read user profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Predictions: users can manage their own
CREATE POLICY "Users can read own predictions" ON predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own predictions" ON predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions" ON predictions FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: users can read their own
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_predictions_updated_at BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
