CREATE ROLE postgres WITH LOGIN PASSWORD 'root';
ALTER ROLE postgres SUPERUSER;

/*
CREATE TABLE Users (
    id INT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    avatar VARCHAR(255),
    jwt VARCHAR(255),
    id42 INT
);

CREATE TABLE Parties (
    id INT PRIMARY KEY,
    player_1 INT,
    player_2 INT,
    datetime_begin TIMESTAMP,
    datetime_end TIMESTAMP,
    ended BOOL,
    score_player_1 INT,
    score_player_2 INT,
    winner INT,
    loser INT,
    FOREIGN KEY (player_1) REFERENCES users(id),
    FOREIGN KEY (player_2) REFERENCES users(id),
    FOREIGN KEY (winner) REFERENCES users(id),
    FOREIGN KEY (loser) REFERENCES users(id)
);
*/
