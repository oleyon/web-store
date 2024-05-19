using WebApi.Db;
using WebApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Identity;
using WebApi.Models;
using WebApi.Repository;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddIdentity<AppUser, IdentityRole>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<UserManager<AppUser>>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => 
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT_SECRET"])),
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddSingleton<RedisRepository>();
builder.Services.AddScoped<RedisService>();
builder.Services.AddSingleton<TokenService>();
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000",
                              "http://localhost:5173");
                          policy.AllowCredentials();
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                      });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);
app.UseStaticFiles();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.None,
});

app.Use(async (context, next) =>
{
    var token = context.Request.Cookies["accessToken"];
    if (!string.IsNullOrEmpty(token))
    {
        context.Request.Headers.Add("Authorization", "Bearer " + token);
    }

    await next();
});

app.UseAuthentication();

app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var roles = new[] { "admin", "user" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
    var user = new AppUser()
    {
        UserName = "admin",
        Email = "admin@localhost",
    };
    var result = await userManager.CreateAsync(user, app.Configuration["ADMIN_PASS"]);

    if (result.Succeeded)
    {
        await userManager.AddToRoleAsync(user, "admin");
    }
    else
    {
        foreach (var error in result.Errors)
        {
            Console.WriteLine(error.Description);
        }
    }
}

app.MapControllers();

app.Run();
