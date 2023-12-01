CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`salary` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`from` integer NOT NULL,
	`to` integer NOT NULL,
	PRIMARY KEY(`from`, `to`),
	FOREIGN KEY (`from`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `operations` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	`amount` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`receiver_id` integer NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
