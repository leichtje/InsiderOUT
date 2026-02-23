using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Insider_OUT.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTokenTimestamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.AddColumn<string>(
                name: "UserDepartment",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserFirstName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserLastName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserPhone",
                table: "Users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActivityContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActivityEntityId = table.Column<int>(type: "int", nullable: false),
                    ActivityEntityType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ActivityUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.ActivityId);
                    table.ForeignKey(
                        name: "FK_Activities_Users_ActivityUserId",
                        column: x => x.ActivityUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.DepartmentId);
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    SubjectId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectFirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SubjectLastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SubjectEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SubjectPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SubjectDepartment = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SubjectRole = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SubjectRiskScore = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.SubjectId);
                });

            migrationBuilder.CreateTable(
                name: "Tokens",
                columns: table => new
                {
                    TokenId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TokenType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TokenSeverity = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tokens", x => x.TokenId);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    DocumentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentTokenId = table.Column<int>(type: "int", nullable: false),
                    DocumentName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DocumentLocation = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.DocumentId);
                    table.ForeignKey(
                        name: "FK_Documents_Tokens_DocumentTokenId",
                        column: x => x.DocumentTokenId,
                        principalTable: "Tokens",
                        principalColumn: "TokenId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Emails",
                columns: table => new
                {
                    EmailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmailTokenId = table.Column<int>(type: "int", nullable: false),
                    EmailSubject = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emails", x => x.EmailId);
                    table.ForeignKey(
                        name: "FK_Emails_Tokens_EmailTokenId",
                        column: x => x.EmailTokenId,
                        principalTable: "Tokens",
                        principalColumn: "TokenId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Incidents",
                columns: table => new
                {
                    IncidentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IncidentTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IncidentDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IncidentCreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IncidentUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IncidentAgent = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IncidentTokenId = table.Column<int>(type: "int", nullable: false),
                    IncidentTokenType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IncidentStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IncidentAssignedUserId = table.Column<int>(type: "int", nullable: true),
                    IncidentTiedSubjectId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidents", x => x.IncidentId);
                    table.ForeignKey(
                        name: "FK_Incidents_Subjects_IncidentTiedSubjectId",
                        column: x => x.IncidentTiedSubjectId,
                        principalTable: "Subjects",
                        principalColumn: "SubjectId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Incidents_Tokens_IncidentTokenId",
                        column: x => x.IncidentTokenId,
                        principalTable: "Tokens",
                        principalColumn: "TokenId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Incidents_Users_IncidentAssignedUserId",
                        column: x => x.IncidentAssignedUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ActivityUserId",
                table: "Activities",
                column: "ActivityUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_Entity",
                table: "Activities",
                columns: new[] { "ActivityEntityId", "ActivityEntityType" });

            migrationBuilder.CreateIndex(
                name: "IX_Documents_DocumentTokenId",
                table: "Documents",
                column: "DocumentTokenId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emails_EmailTokenId",
                table: "Emails",
                column: "EmailTokenId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_AssignedUserId",
                table: "Incidents",
                column: "IncidentAssignedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_TiedSubjectId",
                table: "Incidents",
                column: "IncidentTiedSubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_TokenId",
                table: "Incidents",
                column: "IncidentTokenId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_RiskScore",
                table: "Subjects",
                column: "SubjectRiskScore");

            migrationBuilder.CreateIndex(
                name: "IX_Tokens_Type",
                table: "Tokens",
                column: "TokenType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "Emails");

            migrationBuilder.DropTable(
                name: "Incidents");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "Tokens");

            migrationBuilder.DropColumn(
                name: "UserDepartment",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserFirstName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserLastName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserPhone",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
